import { describe, expect, test } from '@jest/globals';
import { createNewYear } from '../../src/utils/utilFunctions';
import { Semester } from '@/components/planner/types';

describe('Creates 3 new semesters based on given Fall year', () => {
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

    const got = createNewYear(inputYear);
    expect(got).toMatchObject(want);
  });
});
