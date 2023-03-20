import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { formatDegreeValidationRequest } from '@/utils/plannerUtils';

import { protectedProcedure, router } from '../trpc';
import { Course, Prisma, Semester } from '@prisma/client';

type PlanData = {
  id: string;
  name: string;
  semesters: (Semester & { courses: Course[] })[];
};
export const validatorRouter = router({
  prereqValidator: protectedProcedure.input(z.string().min(1)).query(async ({ ctx, input }) => {
    try {
      // Fetch current plan
      const planData = await ctx.prisma.plan.findUnique({
        where: {
          id: input,
        },
        select: {
          name: true,
          id: true,
          semesters: {
            include: {
              courses: true,
            },
          },
        },
      });

      if (!planData) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Plan not found',
        });
      }
      const coursesFromApi = await ctx.platformPrisma.courses.findMany({
        select: {
          course_number: true,
          subject_prefix: true,
          id: true,
          prerequisites: true,
          corequisites: true,
          co_or_pre_requisites: true,
        },
      });

      /*  sanitizing data from API db.
       *  TODO: Fix this later somehow
       */
      const courseMapWithIdKey = new Map<string, Prisma.JsonValue>();
      const courseMapWithCodeKey = new Map<
        string,
        {
          prereqs: Prisma.JsonValue;
          coreqs: Prisma.JsonValue;
          co_or_pre_requisites: Prisma.JsonValue;
        }
      >();
      for (const course of coursesFromApi) {
        courseMapWithCodeKey.set(`${course.subject_prefix} ${course.course_number}`, {
          prereqs: course.prerequisites,
          coreqs: course.corequisites,
          co_or_pre_requisites: course.co_or_pre_requisites,
        });
        courseMapWithIdKey.set(course.id, `${course.subject_prefix} ${course.course_number}`);
      }

      /* Hash to store pre req data.
       *  key: course id
       *  value: boolean to represent validity
       */
      const coreqHash = new Map<string, [boolean, number]>();
      const preReqHash = new Map<string, [boolean, number]>();
      const coOrPreqHash = new Map<string, [boolean, number]>();
      /* Recursive function to check for prereqs.
       *  TODO: Move to a client side function. Possibly a hook.
       */
      for (let i = 0; i < planData?.semesters.length; i++) {
        if (!planData?.semesters[i] || !planData?.semesters[i].courses) continue;
        for (let j = 0; j < planData?.semesters[i].courses.length; j++) {
          const course = planData?.semesters[i].courses[j];
          coreqHash.set(course.code, [true, i]);
          preReqHash.set(course.code, [true, i]);
          coOrPreqHash.set(course.code, [true, i]);
        }
      }
      const checkForPreRecursive = (requirements: CollectionOptions, semester: number): boolean => {
        if (requirements.options.length === 0) {
          return true;
        }
        let flag = 0;
        for (const option of requirements.options) {
          if (option.type === 'course') {
            const course = courseMapWithIdKey.get(option.class_reference);
            if (course) {
              const preReq = courseMapWithCodeKey.get(course as string);
              if (preReq) {
                const data = preReqHash.get(course as string);
                if (!data) continue;
                if (data[1] < semester) {
                  flag++;
                }
              }
            }
          } else if (option.type === 'collection') {
            if (checkForPreRecursive(option, semester)) {
              flag++;
            }
          }
        }
        if (flag >= requirements.required) {
          return true;
        }
        return false;
      };
      const checkForCoRecursive = (requirements: CollectionOptions, semester: number): boolean => {
        if (requirements.options.length === 0) {
          return true;
        }
        let flag = 0;
        for (const option of requirements.options) {
          if (option.type === 'course') {
            const course = courseMapWithIdKey.get(option.class_reference);
            if (course) {
              const preReq = courseMapWithCodeKey.get(course as string);
              if (preReq) {
                const data = coreqHash.get(course as string);
                if (!data) continue;
                if (data[1] === semester) {
                  flag++;
                }
              }
            }
          } else if (option.type === 'collection') {
            if (checkForCoRecursive(option, semester)) {
              flag++;
            }
          }
        }
        if (flag >= requirements.required) {
          return true;
        }
        return false;
      };
      const checkForCoOrPreRecursive = (
        requirements: CollectionOptions,
        semester: number,
      ): boolean => {
        if (requirements.options.length === 0) {
          return true;
        }
        let flag = 0;
        for (const option of requirements.options) {
          if (option.type === 'course') {
            const course = courseMapWithIdKey.get(option.class_reference);
            if (course) {
              const preReq = courseMapWithCodeKey.get(course as string);
              if (preReq) {
                const data = coOrPreqHash.get(course as string);
                if (!data) continue;
                if (data[1] <= semester) {
                  flag++;
                }
              }
            }
          } else if (option.type === 'collection') {
            if (checkForCoOrPreRecursive(option, semester)) {
              flag++;
            }
          }
        }
        if (flag >= requirements.required) {
          return true;
        }
        return false;
      };
      const prereqValidation = async (planData: PlanData) => {
        for (let i = 0; i < planData?.semesters.length; i++) {
          if (!planData?.semesters[i] || !planData?.semesters[i].courses) continue;
          for (let j = 0; j < planData?.semesters[i].courses.length; j++) {
            const course = planData?.semesters[i].courses[j];
            const preReqsForCourse = courseMapWithCodeKey.get(course.code);
            if (!preReqsForCourse) {
              continue;
            }

            const flag = checkForPreRecursive(preReqsForCourse.prereqs as CollectionOptions, i);
            preReqHash.set(course.code, [flag, i]);
          }
        }
      };

      const coreqValidation = async (planData: PlanData) => {
        for (let i = 0; i < planData?.semesters.length; i++) {
          if (!planData?.semesters[i] || !planData?.semesters[i].courses) continue;
          for (let j = 0; j < planData?.semesters[i].courses.length; j++) {
            const course = planData?.semesters[i].courses[j];
            const preReqsForCourse = courseMapWithCodeKey.get(course.code);
            if (!preReqsForCourse) {
              continue;
            }
            const flag = checkForCoRecursive(preReqsForCourse.coreqs as CollectionOptions, i);
            coreqHash.set(course.code, [flag, i]);
          }
        }
      };
      const coOrPrereqValidation = async (planData: PlanData) => {
        for (let i = 0; i < planData?.semesters.length; i++) {
          if (!planData?.semesters[i] || !planData?.semesters[i].courses) continue;
          for (let j = 0; j < planData?.semesters[i].courses.length; j++) {
            const course = planData?.semesters[i].courses[j];
            const preReqsForCourse = courseMapWithCodeKey.get(course.code);
            if (!preReqsForCourse) {
              continue;
            }
            const flag = checkForCoOrPreRecursive(
              preReqsForCourse.co_or_pre_requisites as CollectionOptions,
              i,
            );
            coOrPreqHash.set(course.code, [flag, i]);
          }
        }
      };
      await prereqValidation(planData);
      await coreqValidation(planData);
      await coOrPrereqValidation(planData);

      coOrPreqHash.forEach((value, key) => {
        const preReq = preReqHash.get(key);
        const coReq = coreqHash.get(key);
        if (!coReq || !preReq) return;
        preReqHash.set(key, [value[0] && coReq[0] && preReq[0], value[1]]);
      });
      return { prereqValidation: preReqHash };
    } catch (error) {
      console.log('ERROR');
      console.log(error);
    }
  }),
  degreeValidator: protectedProcedure.input(z.string().min(1)).query(async ({ ctx, input }) => {
    try {
      // Fetch current plan
      const planData = await ctx.prisma.plan.findUnique({
        where: {
          id: input,
        },
        select: {
          name: true,
          id: true,
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

      const { semesters, transferCredits } = planData;

      // Get degree requirements
      const degreeRequirements = await ctx.prisma.degreeRequirements.findFirst({
        where: {
          planId: planData.id,
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

      const body = formatDegreeValidationRequest(
        semestersWithCourses,
        validTransferCredits,
        {
          core: true,
          majors: [degreeRequirements.major], // TODO: Standardize names
          minors: [],
        },
        bypasses,
      );

      const validationData = await fetch(`${process.env.VALIDATOR}/test-validate`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'content-type': 'application/json',
        },
      }).then(async (res) => {
        // Throw error if bad
        if (res.status !== 200) {
          return { can_graduate: false, requirements: [] };
        }
        const rawData = await res.json();
        return rawData;
      });

      return { plan: planData, validation: validationData, bypasses };
    } catch (error) {
      console.log('ERROR');
      console.log(error);
    }
  }),
});

type CourseOptions = {
  class_reference: string;
  type: 'course';
};

type CollectionOptions = {
  required: number;
  type: 'collection';
  options: Array<CourseOptions> | Array<CollectionOptions>;
};
