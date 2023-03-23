import { Prisma as PlatformPrisma } from '../../../../prisma/generated/platform';
import { Mutex } from 'async-mutex';
import { platformPrisma } from '@/server/db/platform_client';
import { env } from '@/env/server.mjs';

type CoursesFromAPI = Array<
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

class Cache {
  _inner: CoursesFromAPI | null = null;
  _mutex: Mutex = new Mutex();
  id: number;

  constructor(id: number) {
    this.id = id;
  }
  log(msg: string) {
    console.log(`===== Cache ${this.id}: ${msg} =====`);
  }

  async get(): Promise<NonNullable<CoursesFromAPI>> {
    this.log('attempting to acquire mutex');
    const release = await this._mutex.acquire();
    this.log('mutex acquired');

    if (!platformPrisma) {
      throw new Error('Cache needs platform client to be initialized');
    }

    if (this._inner === null) {
      this.log('fetching Courses from API');
      this._inner = await platformPrisma.courses.findMany({
        select: {
          title: true,
          course_number: true,
          subject_prefix: true,
          id: true,
          prerequisites: true,
          corequisites: true,
          co_or_pre_requisites: true,
        },
      });
    }

    release();
    return this._inner;
  }
}

declare global {
  // eslint-disable-next-line no-var
  var cachedCoursesFromAPI: Cache | null;
}

export const cachedCoursesFromAPI = global.cachedCoursesFromAPI || new Cache(Math.random());

if (env.NODE_ENV !== 'production') {
  global.cachedCoursesFromAPI = cachedCoursesFromAPI;
}
