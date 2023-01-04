import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';

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
                courses: {
                  select: {
                    name: true,
                    description: true,
                  },
                },
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
  deleteSemesterById: protectedProcedure
    .input(
      z.object({
        planId: z.string().min(1),
        semesterId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const semesterId = await ctx.prisma.user.findUnique({
          where: {
            id: ctx.session.user.id,
          },
          select: {
            plans: {
              where: {
                id: input.planId,
              },
              select: {
                id: true,
                semesters: {
                  where: {
                    id: input.semesterId,
                  },
                  select: {
                    id: true,
                  },
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
});
