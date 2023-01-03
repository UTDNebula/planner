import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';

export const planRouter = router({
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
            semesters: {
              select: {
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
});
