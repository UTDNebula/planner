import { Prisma } from '@prisma/client';
import { router, publicProcedure } from '../trpc';

import rawCourses from '@data/courses.json';

export type RequisiteType = {
  type: string;
  options: JSONCourse[];
  required: number;
};

export type JSONCourse = {
  id: string;
  co_or_pre_requisites: RequisiteType;
  corequisites: RequisiteType;
  course_number: string;
  prerequisites: RequisiteType;
  subject_prefix: string;
  title: string;
};
export const coursesRouter = router({
  publicGetAllCourses: publicProcedure.query(async ({ ctx }) => {
    return rawCourses as unknown as JSONCourse;
  }),
  publicGetSanitizedCourses: publicProcedure.query(async ({ ctx }) => {
    const courses = await ctx.platformPrisma.courses.findMany({
      select: {
        course_number: true,
        subject_prefix: true,
        id: true,
        prerequisites: true,
        corequisites: true,
      },
    });

    const courseMapWithIdKey = new Map<string, Prisma.JsonValue>();
    const courseMapWithCodeKey = new Map<string, Prisma.JsonValue>();

    for (const course of courses) {
      courseMapWithCodeKey.set(`${course.subject_prefix} ${course.course_number}`, {
        prereq: course.prerequisites,
        coreq: course.corequisites,
      });
      courseMapWithIdKey.set(course.id, `${course.subject_prefix} ${course.course_number}`);
    }
    // print the map

    return courseMapWithCodeKey;
  }),
});
