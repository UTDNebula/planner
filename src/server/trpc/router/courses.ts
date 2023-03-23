import { Prisma } from '@prisma/client';
import { router, publicProcedure } from '../trpc';
import { Prisma as PlatformPrisma } from '../../../../prisma/generated/platform';
import { cachedCoursesFromAPI } from './prefetch';

export type CoursesFromAPI = Array<
  PlatformPrisma.coursesGetPayload<{
    select: {
      title: true;
      course_number: true;
      subject_prefix: true;
      id: true;
      prerequisites: true;
      corequisites: true;
      co_or_pre_requisites: true;
    };
  }>
> | null;

export const coursesRouter = router({
  publicGetAllCourses: publicProcedure.query(async () => {
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
