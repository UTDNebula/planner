import { Mutex } from 'async-mutex';
import { courses as Course } from 'prisma/generated/platform';

import { platformPrisma } from '@/server/db/platform_client';

class CourseCacheError extends Error {
  name = 'CourseCacheError';
}

class CourseCache {
  private coursesByYear: Map<number, Course[]> = new Map();
  private mutex = new Mutex();

  public async getCourses(year: number) {
    const formattedYear = year.toString().slice(-2);
    // Acquire lock before success check so if another request is fetching, we don't fetch again.
    const release = await this.mutex.acquire();
    if (this.coursesByYear.has(year)) {
      release();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.coursesByYear.get(year)!; // Must exist at this point
    }

    console.info(`Fetching courses for year ${year}...`);
    return await platformPrisma.courses
      .findMany({
        where: {
          catalog_year: formattedYear,
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
