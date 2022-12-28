import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { type OnboardingFormData } from '@/pages/app/onboarding';

import { router, publicProcedure, protectedProcedure } from '../trpc';

export const userRouter = router({
  getUser: protectedProcedure.query(({ ctx }) => {
    const userInfo = ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        name: true,
        email: true,
        emailVerified: true,
        onboardingComplete: true,
      },
    });
    if (!userInfo) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    return userInfo;
  }),
  updateUserOnboard: protectedProcedure
    .input(
      z.object({
        classification: z.string().min(1),
        disclaimer: z.boolean(),
        personalization: z.boolean(),
        analytics: z.boolean(),
        performance: z.boolean(),
        preferredName: z.string().min(1),
        majors: z.array(z.string()).min(1),
        onCampus: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      // const user = await ctx.prisma.profile.create({
      //   data: {
      //     name: input.preferredName,
      //     disclaimer: input.disclaimer,
      //     personalization: input.personalization,
      //     analytics: input.analytics,
      //     performance: input.performance,
      //     classification: input.classification,
      //     majors: input.majors,
      //     user: {
      //       connect: {
      //         id: userId,
      //       },
      //     },
      //   },
      // });
      const user = await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          onboardingComplete: true,
          profile: {
            upsert: {
              create: {
                name: input.preferredName,
                disclaimer: input.disclaimer,
                personalization: input.personalization,
                analytics: input.analytics,
                performance: input.performance,
                classification: input.classification,
                majors: input.majors,
              },
              update: {
                name: input.preferredName,
                disclaimer: input.disclaimer,
                personalization: input.personalization,
                analytics: input.analytics,
                performance: input.performance,
                classification: input.classification,
                majors: input.majors,
              },
            },
          },
        },
      });
      console.table(user);
      return user;
    }),
});
