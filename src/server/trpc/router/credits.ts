import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

export const creditsRouter = router({
  getCredits: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    return await ctx.prisma.credit.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        courseCode: true,
        semesterCode: true,
      },
    });
  }),
  addCredit: protectedProcedure
    .input(
      z.object({
        courseCode: z.string(),
        semesterCode: z.object({ semester: z.enum(['f', 's', 'u']), year: z.number() }).nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { courseCode, semesterCode } = input;
      console.log('TEST');
      try {
        await ctx.prisma.credit.create({
          data: {
            userId,
            courseCode,
            semesterCode,
          },
        });
        console.log('HUH');
        return true;
      } catch (error) {
        console.log(error);
      }
    }),
  removeCredit: protectedProcedure
    .input(
      z.object({
        courseCode: z.string(),
        semesterCode: z.object({ semester: z.enum(['f', 's', 'u']), year: z.number() }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { courseCode, semesterCode } = input;

      try {
        const creditToDelete = await ctx.prisma.credit.findFirst({
          where: {
            userId,
            courseCode,
            semesterCode,
          },
        });

        await ctx.prisma.credit.delete({
          where: { id: creditToDelete?.id },
        });
        return true;
      } catch (error) {}
    }),
});
