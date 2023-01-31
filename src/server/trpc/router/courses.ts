import { protectedProcedure, router } from '../trpc';

export const coursesRouter = router({
  getAllCourses: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.platformPrisma.courses.findMany({
      select: {
        subject_prefix:true,
        course_number:true,
    }
  });
  })
});