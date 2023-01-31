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
        transfer: true,
      },
    });
  }),
  addCredit: protectedProcedure
    .input(
      z.object({
        courseCode: z.string(),
        semesterCode: z.object({ semester: z.enum(['f', 's', 'u']), year: z.number() }),
        transfer: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { courseCode, semesterCode, transfer } = input;
      try {
        await ctx.prisma.credit.create({
          data: {
            userId,
            courseCode,
            semesterCode: { semester: semesterCode.semester, year: semesterCode.year },
            transfer,
          },
        });
        return true;
      } catch (error) {
        console.log(error);
      }
    }),
  addManyCredits: protectedProcedure
    .input(
      z.array(
        z.object({
          courseCode: z.string(),
          semesterCode: z.object({ semester: z.enum(['f', 's', 'u']), year: z.number() }),
          transfer: z.boolean(),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      try {
        await ctx.prisma.credit.createMany({
          data: input.map(({ courseCode, semesterCode, transfer })=>({
            userId,
            courseCode,
            semesterCode: { semester: semesterCode.semester, year: semesterCode.year },
            transfer,
          })),
        });
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
            semesterCode: { semester: semesterCode.semester, year: semesterCode.year },
          },
        });

        await ctx.prisma.credit.delete({
          where: { id: creditToDelete?.id },
        });
        return true;
      } catch (error) {}
    }),
});
