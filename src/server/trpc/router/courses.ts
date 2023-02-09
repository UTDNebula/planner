import { router, publicProcedure } from '../trpc';

export const coursesRouter = router({
  publicGetAllCourses: publicProcedure.query(async ({ ctx }) => {
    return await ctx.platformPrisma.courses.findMany({
      select: {
        course_number: true,
        subject_prefix: true,
        id: true,
        prerequisites: true,
      },
    });
  }),
});
