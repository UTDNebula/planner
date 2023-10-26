import { Prisma } from '@prisma/client';

import { courseCache } from './courseCache';
import { router, publicProcedure } from '../trpc';

export const coursesRouter = router({
  publicGetAllCourses: publicProcedure.query(async () => {
    return await courseCache.getCourses(new Date().getFullYear());
  }),
});
