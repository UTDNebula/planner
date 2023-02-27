import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { Semester } from '@/components/planner/types';
import { formatDegreeValidationRequest } from '@/utils/plannerUtils';
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
          transferCredits: true,
        },
      });

      if (!planData) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Plan not found',
        });
      }

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

      return { plan: planData, validation: validationData };
    } catch (error) {
      console.log('ERROR');
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
            courseColors: {
              push: '',
            },
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
            courseColors: true,
          },
        });
        const index = semester?.courses.findIndex((course) => courseName == course);
        if (index) {
          const newColors = [...(semester?.courseColors || [])];
          newColors.splice(index, 1);
          // Update courses
          await ctx.prisma.semester.update({
            where: {
              id: semesterId,
            },
            data: {
              courses: semester!.courses.filter((cName) => cName != courseName),
              courseColors: newColors,
            },
          });
        }
        return true;
      } catch (error) {
        console.error(error);
      }
    }),
  deleteAllCoursesFromSemester: protectedProcedure
    .input(z.object({ semesterId: z.string() }))
    .mutation(async ({ ctx, input: { semesterId } }) => {
      await ctx.prisma.semester
        .update({
          where: { id: semesterId },
          data: {
            courses: [],
            courseColors: [],
          },
        })
        .catch((err) => {
          if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2025') {
              throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Semester does not exist',
              });
            }
          }
        });
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
            courseColors: true,
          },
        });

        const index = oldSemester?.courses.findIndex((course) => courseName == course);
        const newColors = [...(oldSemester?.courseColors || [])];
        if (index) newColors.splice(index, 1);
        // Update courses
        await ctx.prisma.semester.update({
          where: {
            id: oldSemesterId,
          },
          data: {
            courses: oldSemester!.courses.filter((cName) => cName != courseName),
            courseColors: newColors,
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
            courses: {
              push: courseName,
            },
            courseColors: {
              push: '',
            },
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
        return await fetch('http://0.0.0.0:5001/test-validate', {
          method: 'POST',
          body: JSON.stringify(input),
          headers: {
            'content-type': 'application/json',
          },
        }).then(async (res) => {
          const rawData = await res.json();

          return rawData;
          // Transform data
        });
      } catch (error) {
        console.log(error);
      }
    }),
  changeSemesterColor: protectedProcedure
    .input(
      z.object({
        semesterId: z.string(),
        color: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.semester.update({
        where: {
          id: input.semesterId,
        },
        data: {
          color: input.color,
        },
      });
      return true;
    }),
  changeCourseColor: protectedProcedure
    .input(
      z.object({
        planId: z.string(),
        semesterId: z.string(),
        courseName: z.string(),
        color: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const semester = await ctx.prisma.semester.findUnique({
        where: {
          id: input.semesterId,
        },
      });
      console.log({ course: semester?.courses, name: input.courseName });
      const index = semester?.courses.findIndex((course) => input.courseName == course);
      if (index) {
        const newColors = [...(semester?.courseColors || [])];
        newColors[index] = input.color;
        await ctx.prisma.semester.update({
          where: {
            id: input.semesterId,
          },
          data: {
            courseColors: newColors,
          },
        });
      }
      return true;
    }),
});
