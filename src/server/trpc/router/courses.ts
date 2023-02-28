import { Prisma } from '@prisma/client';
import { router, publicProcedure } from '../trpc';

export const coursesRouter = router({
  publicGetAllCourses: publicProcedure.query(async ({ ctx }) => {
    const courses = await ctx.platformPrisma.courses.findMany({
      select: {
        course_number: true,
        subject_prefix: true,
        id: true,
        prerequisites: true,
      },
    });
    return courses;
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

type Courses = {
  code: string;
  prereq: Array<Prerequisites>;
};

type Prerequisites = {
  codes: Array<string>;
  type: string;
  required: number;
};
