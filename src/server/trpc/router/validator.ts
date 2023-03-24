import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { formatDegreeValidationRequest } from '@/utils/plannerUtils';

import { protectedProcedure, router } from '../trpc';
import { Course, Prisma, Semester } from '@prisma/client';
import courses, { JSONCourse } from '@data/courses.json';

type PlanData = {
  id: string;
  name: string;
  semesters: (Semester & { courses: Course[] })[];
  transferCredits: string[];
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
          transferCredits: true,
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
      const coursesFromApi: JSONCourse[] = courses;
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
      const courseHash = new Map<string, number>();
      const coReqHash = new Map<string, Array<[Array<string>, number]>>();
      const preReqHash = new Map<string, Array<[Array<string>, number]>>();
      const coOrPreReqHash = new Map<string, Array<[Array<string>, number]>>();
      /* Recursive function to check for prereqs.
       *  TODO: Move to a client side function. Possibly a hook.
       */
      for (let i = 0; i < planData?.semesters.length; i++) {
        if (!planData?.semesters[i] || !planData?.semesters[i].courses) continue;
        for (let j = 0; j < planData?.semesters[i].courses.length; j++) {
          const course = planData?.semesters[i].courses[j];
          courseHash.set(course.code.trim(), i);
        }
      }

      // Run on transfer credits
      for (let i = 0; i < planData.transferCredits.length; i++) {
        const course = planData.transferCredits[i];
        courseHash.set(course.trim(), -1);
      }

      const checkForPreRecursive = (
        requirements: CollectionOptions,
        semester: number,
      ): Array<[Array<string>, number]> => {
        const prereqNotMet: Array<[Array<string>, number]> = [];
        let count = 0;
        if (requirements.options.length === 0) {
          return [];
        }
        const temp: [Array<string>, number] = [[], 0];
        for (const option of requirements.options) {
          if (option.type === 'course') {
            const course = courseMapWithIdKey.get(option.class_reference);
            if (course) {
              const data = courseHash.get(course as string);
              if (data === undefined) {
                temp[0].push(course as string);
              } else if (data < semester) {
                count++;
              } else {
                temp[0].push(course as string);
              }
            }
          } else if (option.type === 'collection') {
            const prereq = checkForPreRecursive(option, semester);
            if (prereq.length > 0) {
              prereqNotMet.push(...prereq);
            } else {
              count++;
            }
          } else if (option.type === 'other') {
            count++;
          }
        }

        if (count >= requirements.required) {
          return [];
        }
        if (temp[0].length > 0) {
          temp[1] = requirements.required - count;
          prereqNotMet.push(temp);
        }
        return prereqNotMet;
      };

      const checkForCoRecursive = (
        requirements: CollectionOptions,
        semester: number,
      ): Array<[Array<string>, number]> => {
        const coreqNotMet: Array<[Array<string>, number]> = [];
        let count = 0;
        if (requirements.options.length === 0) {
          return [];
        }
        const temp: [Array<string>, number] = [[], 0];
        for (const option of requirements.options) {
          if (option.type === 'course') {
            const course = courseMapWithIdKey.get(option.class_reference);
            if (course) {
              const data = courseHash.get(course as string);
              if (data === undefined) {
                temp[0].push(course as string);
                continue;
              }
              if (data <= semester) {
                count++;
              } else {
                temp[0].push(course as string);
              }
            }
          } else if (option.type === 'collection') {
            const coreq = checkForCoRecursive(option, semester);
            if (coreq.length > 0) {
              coreqNotMet.push(...coreq);
            } else {
              count++;
            }
          } else if (option.type === 'other') {
            count++;
          }
        }
        if (count >= requirements.required) {
          return [];
        }
        if (temp[0].length > 0) {
          temp[1] = requirements.required;
          coreqNotMet.push(temp);
        }
        return coreqNotMet;
      };

      const checkForCoOrPreRecursive = (
        requirements: CollectionOptions,
        semester: number,
      ): Array<[Array<string>, number]> => {
        const coreqNotMet: Array<[Array<string>, number]> = [];
        let count = 0;
        if (requirements.options.length === 0) {
          return [];
        }
        const temp: [Array<string>, number] = [[], 0];
        for (const option of requirements.options) {
          if (option.type === 'course') {
            const course = courseMapWithIdKey.get(option.class_reference);
            if (course) {
              const data = courseHash.get(course as string);
              if (data === undefined) {
                temp[0].push(course as string);
                continue;
              }
              if (data <= semester) {
                count++;
              } else {
                temp[0].push(course as string);
              }
            }
          } else if (option.type === 'collection') {
            const coreq = checkForCoOrPreRecursive(option, semester);
            if (coreq.length > 0) {
              coreqNotMet.push(...coreq);
            } else {
              count++;
            }
          } else if (option.type === 'other') {
            count++;
          }
        }
        if (count >= requirements.required) {
          return [];
        }
        if (temp[0].length > 0) {
          temp[1] = requirements.required;
          coreqNotMet.push(temp);
        }
        return coreqNotMet;
      };
      const prereqValidation = async (planData: PlanData) => {
        for (let i = 0; i < planData?.semesters.length; i++) {
          if (!planData?.semesters[i] || !planData?.semesters[i].courses) continue;
          for (let j = 0; j < planData?.semesters[i].courses.length; j++) {
            const course = planData?.semesters[i].courses[j];
            const reqsForCourse = courseMapWithCodeKey.get(course.code);
            if (!reqsForCourse) {
              continue;
            }
            const flag = checkForPreRecursive(reqsForCourse.prereqs as CollectionOptions, i);
            preReqHash.set(course.code, flag);
          }
        }
      };

      const coreqValidation = async (planData: PlanData) => {
        for (let i = 0; i < planData?.semesters.length; i++) {
          if (!planData?.semesters[i] || !planData?.semesters[i].courses) continue;
          for (let j = 0; j < planData?.semesters[i].courses.length; j++) {
            const course = planData?.semesters[i].courses[j];
            const reqsForCourse = courseMapWithCodeKey.get(course.code);
            if (!reqsForCourse) {
              continue;
            }
            const flag = checkForCoRecursive(reqsForCourse.coreqs as CollectionOptions, i);
            coReqHash.set(course.code, flag);
          }
        }
      };
      const coOrPrereqValidation = async (planData: PlanData) => {
        // for (let i = 0; i < planData.transferCredits.length; i++) {
        //   const course = planData.transferCredits[i];
        //   const reqsForCourse = courseMapWithCodeKey.get(course);
        //   if (!reqsForCourse) {
        //     continue;
        //   }
        //   const flag = checkForCoOrPreRecursive(reqsForCourse.prereqs as CollectionOptions, i);
        //   coOrPreReqHash.set(course, flag);
        // }
        for (let i = 0; i < planData?.semesters.length; i++) {
          if (!planData?.semesters[i] || !planData?.semesters[i].courses) continue;
          for (let j = 0; j < planData?.semesters[i].courses.length; j++) {
            const course = planData?.semesters[i].courses[j];
            const reqsForCourse = courseMapWithCodeKey.get(course.code);
            if (!reqsForCourse) {
              continue;
            }
            const flag = checkForCoOrPreRecursive(
              reqsForCourse.co_or_pre_requisites as CollectionOptions,
              i,
            );
            coOrPreReqHash.set(course.code, flag);
          }
        }
      };
      await prereqValidation(planData);
      await coreqValidation(planData);
      await coOrPrereqValidation(planData);

      return { prereq: preReqHash, coreq: coReqHash, coorepre: coOrPreReqHash };
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
