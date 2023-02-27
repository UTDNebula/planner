import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { formatDegreeValidationRequest } from '@/utils/plannerUtils';

import { protectedProcedure, router } from '../trpc';
import { Prisma } from '@prisma/client';

export const validatorRouter = router({
  validatePlan: protectedProcedure.input(z.string().min(1)).query(async ({ ctx, input }) => {
    try {
      // Fetch current plan
      const planData = await ctx.prisma.plan.findUnique({
        where: {
          id: input,
        },
        select: {
          name: true,
          id: true,
          semesters: true,
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
        },
      });

      /*  sanitizing data from API db.
       *  TODO: Fix this later somehow
       */
      const courseMapWithIdKey = new Map<string, Prisma.JsonValue>();
      const courseMapWithCodeKey = new Map<string, Prisma.JsonValue>();
      for (const course of coursesFromApi) {
        courseMapWithCodeKey.set(
          `${course.subject_prefix} ${course.course_number}`,
          course.prerequisites,
        );
        courseMapWithIdKey.set(course.id, `${course.subject_prefix} ${course.course_number}`);
      }

      /* Hash to store pre req data.
       *  key: course id
       *  value: boolean to represent validity
       */
      const preReqHash = new Map<string, boolean>();
      /* Recursive function to check for prereqs.
       *  TODO: Move to a client side function. Possibly a hook.
       */
      const checkForPreRecursive = (requirements: CollectionOptions): boolean => {
        if (requirements.options.length === 0) {
          return true;
        }
        let flag = 0;
        for (const option of requirements.options) {
          if (option.type === 'course') {
            const course = courseMapWithIdKey.get(option.class_reference);
            if (course) {
              const preReq = courseMapWithCodeKey.get(course as any as string);
              if (preReq) {
                if (preReqHash.has(course as any as string)) {
                  flag++;
                }
              }
            }
          } else if (option.type === 'collection') {
            if (checkForPreRecursive(option)) {
              flag++;
            }
          }
        }
        if (flag >= requirements.required) {
          return true;
        }
        return false;
      };
      const prereqValidation = async (planData: any) => {
        for (let i = 0; i < planData?.semesters.length; i++) {
          if (!planData?.semesters[i] || !planData?.semesters[i].courses) continue;
          for (let j = 0; j < planData?.semesters[i].courses.length; j++) {
            const course = planData?.semesters[i].courses[j];
            const preReqsForCourse = courseMapWithCodeKey.get(course);
            if (!preReqsForCourse) {
              continue;
            }
            const flag = checkForPreRecursive(preReqsForCourse as any as CollectionOptions);
            preReqHash.set(course, flag);
            // console.log({ course, flag });
          }
        }
      };

      await prereqValidation(planData);

      preReqHash.forEach((value, key) => {
        console.log({ key, value });
      });
      const { semesters } = planData;
      // FIX THIS LATER IDC RN
      const temporaryFunctionPlzDeleteThis = async () => {
        return semesters.map((sem) => {
          const courses = sem.courses.filter((course) => {
            const [possiblePrefix, possibleCode] = course.split(' ');
            if (Number.isNaN(Number(possibleCode)) || !Number.isNaN(Number(possiblePrefix))) {
              return false;
            }
            return true;
          });
          return { ...sem, courses };
        });
      };

      const hehe = await temporaryFunctionPlzDeleteThis();

      // Get degree requirements
      const degreeRequirements = await ctx.prisma.degreeRequirements.findFirst({
        where: {
          planId: planData.id,
        },
      });

      if (!degreeRequirements?.major || degreeRequirements.major === 'undecided') {
        return {  validation: [] };
      }

      const body = formatDegreeValidationRequest(hehe, {
        core: true,
        majors: [degreeRequirements.major], // TODO: Standardize names
        minors: [],
      });

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

      return { validation: validationData, prereqValidation: preReqHash };
    } catch (error) {
      console.log('ERROR');
      console.log(error);
    }
  })})


type CourseOptions = {
  class_reference: string;
  type: 'course';
};

type CollectionOptions = {
  required: number;
  type: 'collection';
  options: Array<CourseOptions> | Array<CollectionOptions>;
};
