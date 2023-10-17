import { Course, Prisma, Semester } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { env } from '@/env/server.mjs';
import { courses as PlatformCourse } from 'prisma/generated/platform';

import { courseCache } from './courseCache';
import { DegreeNotFound, DegreeValidationError } from './errors';
import { getPlanFromUserId } from './plan';
import { protectedProcedure, router } from '../trpc';

type PlanData = {
  id: string;
  name: string;
  semesters: (Semester & { courses: Course[] })[];
  transferCredits: string[];
};
export const validatorRouter = router({
  // Protected route: ensures session user is same as plan owner
  prereqValidator: protectedProcedure.input(z.string().min(1)).query(async ({ ctx, input }) => {
    try {
      // Fetch current plan
      const planData = await getPlanFromUserId(ctx, input);
      if (ctx.session.user.id !== planData.userId) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      let year = new Date().getFullYear(); // If plan has no semesters, default to current year.
      if (planData.semesters.length > 0) {
        // If plan has semesters, default to first semester's year.
        year = Math.min(...planData.semesters.map((sem) => sem.year));
      }

      const coursesFromAPI: PlatformCourse[] = await courseCache.getCourses(year);
      /*  sanitizing data from API db.
       *  TODO: Fix this later somehow
       */

      const courseInternalToCode = new Map<string, Prisma.JsonValue>();
      const courseCodeToReqs = new Map<
        string,
        {
          prereqs: Prisma.JsonValue;
          coreqs: Prisma.JsonValue;
          co_or_pre_requisites: Prisma.JsonValue;
        }
      >();

      for (const course of coursesFromAPI) {
        const code = `${course.subject_prefix} ${course.course_number}`;
        courseCodeToReqs.set(code, {
          prereqs: course.prerequisites,
          coreqs: course.corequisites,
          co_or_pre_requisites: course.co_or_pre_requisites,
        });
        courseInternalToCode.set(course.internal_course_number, code);
      }

      const courseToSemester = new Map<string, number>();

      planData?.semesters.forEach((semester, index) => {
        for (const course of semester.courses) {
          courseToSemester.set(course.code.trim(), index);
        }
      });

      planData?.transferCredits.forEach((course) => {
        courseToSemester.set(course.trim(), -1);
      });

      const checkForRequisites = (
        requirements: CollectionOptions,
        semester: number,
        requisiteType: RequisiteType,
      ) => {
        if (!requirements || requirements.options.length === 0) return [];
        let numRequisitesNotMet = requirements.required;
        const requisitesNotMet: [string[], number][] = [];
        const currentUnmetCourses: string[] = [];
        for (const option of requirements.options) {
          if (option.type === 'course') {
            const courseCode = courseInternalToCode.get(option.class_reference);
            const courseSemesterIndex = courseToSemester.get(courseCode as string);
            if (
              courseSemesterIndex !== undefined &&
              ((requisiteType == RequisiteType.PRE && courseSemesterIndex < semester) ||
                courseSemesterIndex <= semester)
            ) {
              // course is satisfied
              numRequisitesNotMet--;
            } else {
              currentUnmetCourses.push(courseCode as string);
            }
          } else if (option.type === 'collection') {
            const nestedRequisitesNotMet = checkForRequisites(option, semester, requisiteType);
            if (nestedRequisitesNotMet.length > 0) {
              requisitesNotMet.push(...nestedRequisitesNotMet);
            } else {
              numRequisitesNotMet--;
            }
          }
        }

        if (numRequisitesNotMet <= 0) return [];
        if (currentUnmetCourses.length > 0)
          requisitesNotMet.push([currentUnmetCourses, numRequisitesNotMet]);
        return requisitesNotMet;
      };

      enum RequisiteType {
        PRE = 'prereq',
        CO = 'coreq',
        CO_PRE = 'coorpre',
      }

      type RequisitesOutput = Map<string, Array<[Array<string>, number]>>;
      const requisiteOutput: { [Key in RequisiteType]: RequisitesOutput } = {
        [RequisiteType.PRE]: new Map(),
        [RequisiteType.CO]: new Map(),
        [RequisiteType.CO_PRE]: new Map(),
      };

      const validateRequisites = async (planData: PlanData, requisiteType: RequisiteType) => {
        planData?.semesters.forEach((semester, index) => {
          for (const course of semester.courses) {
            const reqsForCourse = courseCodeToReqs.get(course.code);
            const unfulfilledRequisites = checkForRequisites(
              reqsForCourse?.prereqs as CollectionOptions,
              index,
              requisiteType,
            );
            requisiteOutput[requisiteType].set(course.code, unfulfilledRequisites);
          }
        });
      };

      await validateRequisites(planData, RequisiteType.PRE);
      await validateRequisites(planData, RequisiteType.CO);
      await validateRequisites(planData, RequisiteType.CO_PRE);

      return requisiteOutput;
    } catch (error) {
      console.error(error);
      return null;
    }
  }),
  // Protected route: ensures session user is same as plan owner
  degreeValidator: protectedProcedure.input(z.string().min(1)).query(async ({ ctx, input }) => {
    // Fetch current plan
    const planData = await ctx.prisma.plan.findUnique({
      where: {
        id: input,
      },
      select: {
        name: true,
        id: true,
        userId: true,
        semesters: {
          include: {
            courses: true,
          },
        },
        transferCredits: true,
      },
    });

    if (!planData) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Plan not found',
      });
    }

    if (ctx.session.user.id !== planData.userId) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }

    const { semesters, transferCredits } = planData;

    // Get degree requirements
    const degreeRequirements = await ctx.prisma.degreeRequirements.findFirst({
      where: {
        plan: { id: planData.id },
      },
    });

    // Get bypasses
    const bypasses = degreeRequirements?.bypasses ?? [];

    // Remove invalidCourses
    const removeInvalidCoursesFromSemesters = () => {
      return semesters.map((sem) => {
        const courses = sem.courses
          .reduce((acc, curr) => [...acc, curr.code], [] as string[])
          .filter((c) => {
            const [possiblePrefix, possibleCode] = c.split(' ');
            if (Number.isNaN(Number(possibleCode)) || !Number.isNaN(Number(possiblePrefix))) {
              return false;
            }
            return true;
          });
        return { ...sem, courses };
      });
    };

    const semestersWithCourses = removeInvalidCoursesFromSemesters();

    if (!degreeRequirements?.major || degreeRequirements.major === 'undecided') {
      return { plan: planData, validation: [], bypasses: [] };
    }

    // TODO: will we always ignore odd credits such as 'PSY 1---'?
    const regex = /([a-z0-9])* ([a-z0-9]){4}$/gi;
    const validTransferCredits = transferCredits.filter((credit) => credit.match(regex) !== null);

    const body = {
      courses: [...semestersWithCourses.flatMap((s) => s.courses), ...validTransferCredits],
      requirements: {
        year: 2022,
        majors: [degreeRequirements.major],
        minors: [],
      },
      bypasses,
    };

    const res = await fetch(`${env.NEXT_PUBLIC_VALIDATOR}/validate`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'content-type': 'application/json',
      },
    });

    if (!res.ok) {
      const errorMsg = await res.json();
      if (res.status == 404) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: errorMsg.error,
          cause: new DegreeNotFound(errorMsg),
        });
      }

      const error = new DegreeValidationError(
        `Validator fetch failed with stats: ${res.status}, err: ${errorMsg}`,
      );
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message,
        cause: error,
      });
    }

    const validationData = await res.json();
    return { plan: planData, validation: validationData, bypasses };
  }),
});

type CourseOptions = {
  class_reference: string;
  type: 'course';
};

type OtherOptions = {
  type: 'other';
  condition: null;
  description: string;
};

type CollectionOptions = {
  required: number;
  type: 'collection';
  options: Array<CourseOptions> | Array<CollectionOptions> | Array<OtherOptions>;
};
