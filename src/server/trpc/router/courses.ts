import { Prisma } from '@prisma/client';
import { router, publicProcedure } from '../trpc';
import { cachedCoursesFromAPI } from './cache';

export const coursesRouter = router({
  publicGetAllCourses: publicProcedure.query(async () => {
    cachedCoursesFromAPI.log('ATTEMPTING FROM GETALLCOURSES');
    return await cachedCoursesFromAPI.get();
  }),
  publicGetSanitizedCourses: publicProcedure.query(async () => {
    const courses = await cachedCoursesFromAPI.get();
    const courseMapWithIdKey = new Map<string, Prisma.JsonValue>();
    const courseMapWithCodeKey = new Map<string, Prisma.JsonValue>();

    for (const course of courses) {
      courseMapWithCodeKey.set(`${course.subject_prefix} ${course.course_number}`, {
        prereq: course.prerequisites,
        coreq: course.corequisites,
      });
      courseMapWithIdKey.set(course.id, `${course.subject_prefix} ${course.course_number}`);
    }

    return courseMapWithCodeKey;
  }),
});
