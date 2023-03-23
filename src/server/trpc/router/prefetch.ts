import { CoursesFromAPI } from './courses';
import { Mutex } from 'async-mutex';
import { platformPrisma } from '@/server/db/platform_client';

export const cachedCoursesFromAPI: {
  _inner: CoursesFromAPI | null;
  _mutex: Mutex;
  log: (msg: string) => void;
  get: () => Promise<NonNullable<CoursesFromAPI>>;
} = {
  _inner: null,
  _mutex: new Mutex(),
  log: (msg: string) => console.log(`===== Cache: ${msg} =====`),
  get: async (): Promise<NonNullable<CoursesFromAPI>> => {
    cachedCoursesFromAPI.log('attempting to acquire mutex');
    const release = await cachedCoursesFromAPI._mutex.acquire();
    cachedCoursesFromAPI.log('mutex acquired');

    if (!platformPrisma) {
      throw new Error('Cache needs platform client to be initialized');
    }

    if (cachedCoursesFromAPI._inner === null) {
      cachedCoursesFromAPI.log('fetching Courses from API');
      cachedCoursesFromAPI._inner = await platformPrisma.courses.findMany({
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
    return cachedCoursesFromAPI._inner;
  },
};
