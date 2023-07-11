import { describe, expect, test } from '@jest/globals';
import {
  createYearBasedOnFall,
  getSemesterHourFromCourseCode,
} from '../../src/utils/utilFunctions';
import { Semester } from '@/components/planner/types';

describe('createYearBasedOnFall', () => {
  test('0 year', () => {
    const inputYear = 0;
    const want: Omit<Semester, 'id'>[] = [
      {
        code: {
          semester: 'f',
          year: 0,
        },
        color: '',
        courses: [],
        locked: false,
      },
      {
        code: {
          semester: 's',
          year: 1,
        },
        color: '',
        courses: [],
        locked: false,
      },
      {
        code: {
          semester: 'u',
          year: 1,
        },
        color: '',
        courses: [],
        locked: false,
      },
    ];

    const got = createYearBasedOnFall(inputYear);
    expect(got).toMatchObject(want);
  });
});

describe('getSemesterHourFromCourseCode', () => {
  const testCases: { desc: string; course: string; wantResult: 3 | null }[] = [
    {
      desc: 'passing input',
      course: 'HIST 1301',
      wantResult: 3,
    },
    {
      desc: 'malformed course code',
      course: 'HIST1301',
      wantResult: null,
    },
  ];

  test.each(testCases)('$desc', (tc) => {
    const got = getSemesterHourFromCourseCode(tc.course);
    expect(got).toBe(tc.wantResult);
  });
});
