import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const userRouter = router({
  getUser: protectedProcedure
    .query(({ ctx }) => {
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
          code: "NOT_FOUND",
          message: "User not found",
        })
      }

      return userInfo;
    }),
});
