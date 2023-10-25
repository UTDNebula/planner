import { Mutex } from 'async-mutex';

import { MinimalCourse } from '@/components/planner/types';
import { platformPrisma } from '@/server/db/platform_client';
import { courses as Course } from 'prisma/generated/platform';

class CourseCacheError extends Error {
  name = 'CourseCacheError';
}

class CourseCache {
  private coursesByYear: Map<number, MinimalCourse[]> = new Map();
  private coursesById: Map<string, Course> = new Map();
  private mutex = new Mutex();

  public async getCourseById(courseId: string) {
    const release = await this.mutex.acquire();
    if (this.coursesById.has(courseId)) {
      release();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.coursesById.get(courseId)!; // Must exist at this point
    }
    return await platformPrisma.courses
      .findUnique({ where: { id: courseId } })
      .then((course) => {
        console.log('Found course!', course);
        this.coursesById.set(courseId, course);
        return course;
      })
      .catch((err) => {
        const message = `Error fetching course for id ${courseId}`;
        console.error(message);
        throw new CourseCacheError(message, { cause: err });
      });
  }

  public async getCourses() {
    // Acquire lock before success check so if another request is fetching, we don't fetch again.
    const year = new Date().getFullYear(); // current year
    const release = await this.mutex.acquire();
    if (this.coursesByYear.has(year)) {
      release();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.coursesByYear.get(year)!; // Must exist at this point
    }

    console.info(`Fetching courses for year ${year}...`);
    return await platformPrisma.courses
      .findMany({
        distinct: ['subject_prefix', 'course_number', 'title'],
        select: {
          id: true,
          subject_prefix: true,
          course_number: true,
          title: true,
        },
      })
      .then((courses) => {
        this.coursesByYear.set(year, courses);
        return courses;
      })
      .catch((err) => {
        const message = `Error fetching courses for year ${year}: ${err}`;
        console.error(message);
        throw new CourseCacheError(message, { cause: err });
      })
      .finally(release);
  }
}

const courseCache = new CourseCache();

export { courseCache };
