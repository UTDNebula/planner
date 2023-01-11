import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { protectedProcedure, router } from '../trpc';

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
              id: true,
            },
          },
        },
      });
      return plans;
    } catch (error) {}
  }),
  getPlanById: protectedProcedure.input(z.string().min(1)).query(async ({ ctx, input }) => {
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
            name: true,
            id: true,
            semesters: {
              select: {
                id: true,
                name: true,
                code: true,
                courses: true,
              },
            },
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
    return planData.plans[0];
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
  deleteSemester: protectedProcedure.input(z.string().min(1)).mutation(async ({ ctx, input }) => {
    try {
      const semesterId = await ctx.prisma.user.findUnique({
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
              semesters: {
                select: {
                  id: true,
                },
                take: -1,
              },
            },
          },
        },
      });
      await ctx.prisma.semester.delete({
        where: {
          id: semesterId?.plans[0]?.semesters[0]?.id,
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }),
  addEmptySemesterToPlan: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ ctx, input }) => {
      try {
        const plan = await ctx.prisma.plan.findUnique({
          where: {
            id: input,
          },
          select: {
            semesters: {
              select: {
                code: true,
                name: true,
              },
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
        const lastSemesterCode = plan.semesters[0]?.code ? plan.semesters[0]?.code : '2023s';
        let year = lastSemesterCode?.substring(0, 4);
        let season = lastSemesterCode?.substring(4, 5);
        year = season === 'f' ? (parseInt(year) + 1).toString() : year;
        season = season === 'f' ? 's' : 'f';

        const semTitle = `${season === 'f' ? 'Fall' : 'Spring'} ${year}`;
        const semCode = `${year}${season[0].toLowerCase()}`;

        await ctx.prisma.plan.update({
          where: {
            id: input,
          },
          data: {
            semesters: {
              create: {
                code: semCode,
                name: semTitle,
              },
            },
          },
        });
        return true;
      } catch (error) {}
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
      } catch (error) {}
    }),
  removeCourseFromSemester: protectedProcedure
    .input(z.object({ planId: z.string(), semesterId: z.string(), courseName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { semesterId, courseName } = input;

        console.log('GOT UP TO HERE');
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

        const removeCourse = async () => {
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
          return true;
        };

        const addCourse = async () => {
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
        };

        await Promise.all([addCourse, removeCourse]);
        return true;
      } catch (error) {}
    }),
});
