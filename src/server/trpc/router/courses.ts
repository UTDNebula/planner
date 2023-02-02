import { router, publicProcedure } from '../trpc';

export const coursesRouter = router({
  publicGetAllCourses: publicProcedure.query(async ({ ctx }) => {
    return await ctx.platformPrisma.courses.findMany({
      select: {
        subject_prefix: true,
        course_number: true,
    }
  });
  })
});