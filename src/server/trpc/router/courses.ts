import z from 'zod';

import { courseCache } from './courseCache';
import { router, publicProcedure } from '../trpc';

export const coursesRouter = router({
  // only gets course codes and titles for sidebar display
  // TODO: brotli compression
  publicGetAllCourses: publicProcedure.query(async () => {
    return await courseCache.getCourses();
  }),
  publicGetCourseById: publicProcedure.input(z.string()).query(async (opts) => {
    const { input } = opts;
    return await courseCache.getCourseById(input);
  }),
});
