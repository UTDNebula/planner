import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { DegreeRequirementGroup, Semester } from '@/components/planner/types';
import { addCreditsToPlan, formatDegreeValidationRequest } from '@/utils/plannerUtils';
import { createNewYear } from '@/utils/utilFunctions';

import { protectedProcedure, router } from '../trpc';
import { Prisma } from '@prisma/client';

export const planRouter = router({
  getUserPlans: protectedProcedure.query(async ({ ctx }) => {
    try {
      const plans = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          plans: {
            select: {
              name: true,
              requirements: true,
              id: true,
            },
          },
        },
      });
      return plans;
    } catch (error) {}
  }),
  getPlanById: protectedProcedure.input(z.string().min(1)).query(async ({ ctx, input }) => {
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
            console.log({ course, flag });
          }
        }
      };

      await prereqValidation(planData);

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
        return { plan: planData, validation: [] };
      }

      const body = formatDegreeValidationRequest(hehe, degreeRequirements?.major);

      const validationData = await fetch(`${process.env.VALIDATOR}/validate-degree-plan`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'content-type': 'application/json',
        },
      }).then(async (res) => {
        const rawData = await res.json();

        // Throw error if bad
        if (res.status !== 200) {
          return [];
        }
        // Transform data
        const core: DegreeRequirementGroup = { name: 'Core Requirements', requirements: [] };
        const major: DegreeRequirementGroup = { name: 'Major Requirements', requirements: [] };
        const electives: DegreeRequirementGroup = {
          name: 'Free Elective Requirements',
          requirements: [],
        };
        const university: DegreeRequirementGroup = {
          name: 'University Requirements',
          requirements: [],
        };

        Object.keys(rawData).forEach((req: string) => {
          if (req.includes('Free Electives')) {
            electives.requirements.push({ name: req, ...rawData[req] });
          } else if (req.includes('Core - ')) {
            const description = `Select ${rawData[req].hours} credit hours from a list of courses`;
            core.requirements.push({ name: req, ...rawData[req], description });
          } else if ('Minimum Cumulative Hours Upper Level Hour Requirement'.includes(req)) {
            const description = `Select ${rawData[req].hours} credit hours from a list of courses`;
            university.requirements.push({ name: req, ...rawData[req], description });
          } else {
            // Dynamically add description based on case
            // TODO: Should return this info from API kekw

            const description = req.includes('Electives')
              ? `Select ${rawData[req].hours} credit hours from a list of courses`
              : 'Select all courses';

            major.requirements.push({ name: req, ...rawData[req], description });
          }
        });
        return [core, major, electives, university];
      });

      return { plan: planData, validation: validationData, prereqValidation: preReqHash };
    } catch (error) {
      console.log(error);
    }
  }),
  deletePlanById: protectedProcedure.input(z.string().min(1)).mutation(async ({ ctx, input }) => {
    // check if plans belongs to user with id = ctx.session.user.id
    try {
      const planData = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          plans: {
            where: {
              id: input,
            },
            select: {
              id: true,
            },
          },
        },
      });
      const plan = planData?.plans[0];
      await ctx.prisma.plan.delete({
        where: {
          id: plan?.id,
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }),
  deleteYear: protectedProcedure.input(z.string().min(1)).mutation(async ({ ctx, input }) => {
    try {
      const semesterIds = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          plans: {
            where: {
              id: input,
            },
            select: {
              semesters: {
                select: {
                  id: true,
                },
                take: -3,
              },
            },
          },
        },
      });
      await ctx.prisma.semester.deleteMany({
        where: {
          id: { in: semesterIds?.plans[0].semesters.map((val) => val.id) },
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }),
  addYear: protectedProcedure
    .input(z.object({ planId: z.string(), semesterIds: z.array(z.string()).length(3) }))
    .mutation(async ({ ctx, input }) => {
      const { planId, semesterIds } = input;
      try {
        const plan = await ctx.prisma.plan.findUnique({
          where: {
            id: planId,
          },
          select: {
            semesters: {
              take: -1,
            },
          },
        });
        if (!plan) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Plan not found',
          });
        }

        const newYear: Semester[] = createNewYear(
          plan.semesters[0] ? plan.semesters[0].code : { semester: 'u', year: 2022 },
        );

        await ctx.prisma.plan.update({
          where: {
            id: planId,
          },
          data: {
            semesters: {
              createMany: {
                data: newYear.map((semester, idx) => {
                  return {
                    ...semester,
                    courses: semester.courses.map((course) => course.code),
                    id: semesterIds[idx].toString(),
                  };
                }),
              },
            },
          },
        });
        return true;
      } catch (error) {
        console.log(error);
      }
    }),
  addCourseToSemester: protectedProcedure
    .input(z.object({ planId: z.string(), semesterId: z.string(), courseName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Get semester you're adding the course to
      try {
        const { semesterId, courseName } = input;
        // This works bc semesters are stored in its own table
        // Once integrated w/ Nebula API, use Promise.all() to call concurrently
        const semester = await ctx.prisma.semester.findUnique({
          where: { id: semesterId },
          select: {
            id: true,
            courses: true,
          },
        });

        // Update courses
        await ctx.prisma.semester.update({
          where: {
            id: semesterId,
          },
          data: {
            courses: [...semester!.courses, courseName],
          },
        });
        return true;
      } catch (error) {
        console.log(error);
      }
    }),
  removeCourseFromSemester: protectedProcedure
    .input(z.object({ planId: z.string(), semesterId: z.string(), courseName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { semesterId, courseName } = input;

        // This works bc semesters are stored in its own table
        // Once integrated w/ Nebula API, use Promise.all() to call concurrently
        const semester = await ctx.prisma.semester.findUnique({
          where: { id: semesterId },
          select: {
            id: true,
            courses: true,
          },
        });
        // Update courses
        await ctx.prisma.semester.update({
          where: {
            id: semesterId,
          },
          data: {
            courses: semester!.courses.filter((cName) => cName != courseName),
          },
        });
        return true;
      } catch (error) {
        console.error(error);
      }
    }),
  moveCourseFromSemester: protectedProcedure
    .input(
      z.object({
        planId: z.string(),
        oldSemesterId: z.string(),
        newSemesterId: z.string(),
        courseName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { oldSemesterId, newSemesterId, courseName } = input;

        // This works bc semesters are stored in its own table

        // Once integrated w/ Nebula API, use Promise.all() to call concurrently
        const oldSemester = await ctx.prisma.semester.findUnique({
          where: { id: oldSemesterId },
          select: {
            id: true,
            courses: true,
          },
        });

        // Update courses
        await ctx.prisma.semester.update({
          where: {
            id: oldSemesterId,
          },
          data: {
            courses: oldSemester!.courses.filter((cName) => cName != courseName),
          },
        });

        // This works bc semesters are stored in its own table
        // Once integrated w/ Nebula API, use Promise.all() to call concurrently
        const semester = await ctx.prisma.semester.findUnique({
          where: { id: newSemesterId },
          select: {
            id: true,
            courses: true,
          },
        });
        // Update courses
        await ctx.prisma.semester.update({
          where: {
            id: newSemesterId,
          },
          data: {
            courses: [...semester!.courses, courseName],
          },
        });

        return true;
      } catch (error) {
        console.error(error);
      }
    }),
  validateDegreePlan: protectedProcedure
    .input(
      z.object({
        courses: z.array(
          z.object({
            name: z.string(),
            department: z.string(),
            level: z.number(),
            hours: z.number(),
          }),
        ),
        bypasses: z.array(
          z.object({
            course: z.string(),
            requirement: z.string(),
            hours: z.number(),
          }),
        ),
        degree: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        return await fetch('http://0.0.0.0:5001/validate-degree-plan', {
          method: 'POST',
          body: JSON.stringify(input),
          headers: {
            'content-type': 'application/json',
          },
        }).then(async (res) => {
          const rawData = await res.json();
          // Transform data
          const core: DegreeRequirementGroup = { name: 'Core Requirements', requirements: [] };
          const major: DegreeRequirementGroup = { name: 'Major Requirements', requirements: [] };
          const electives: DegreeRequirementGroup = {
            name: 'Free Elective Requirements',
            requirements: [],
          };
          const university: DegreeRequirementGroup = {
            name: 'University Requirements',
            requirements: [],
          };

          Object.keys(rawData).forEach((req: string) => {
            if (req.includes('Free Electives')) {
              electives.requirements.push({ name: req, ...rawData[req] });
            } else if (req.includes('Core - ')) {
              core.requirements.push({ name: req, ...rawData[req] });
            } else if ('Minimum Cumulative Hours Upper Level Hour Requirement'.includes(req)) {
              university.requirements.push({ name: req, ...rawData[req] });
            } else {
              major.requirements.push({ name: req, ...rawData[req] });
            }
          });
          return [core, major, electives, university];
        });
      } catch (error) {
        console.log(error);
      }
    }),
});

type PreReqRequirements = CourseOptions | CollectionOptions;

type CourseOptions = {
  class_reference: string;
  type: 'course';
};

type CollectionOptions = {
  required: number;
  type: 'collection';
  options: Array<CourseOptions> | Array<CollectionOptions>;
};
