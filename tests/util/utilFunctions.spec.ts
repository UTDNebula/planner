import { describe, expect, test } from '@jest/globals';
import {
  createYearBasedOnFall,
  generateSemesters,
  getSemesterHourFromCourseCode,
} from '../../src/utils/utilFunctions';
import { Semester } from '@/components/planner/types';
import { SemesterType } from '@prisma/client';

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
    {
      desc: 'cannot handle letter hours',
      course: 'HIST 1V10',
      wantResult: null,
    },
  ];

  test.each(testCases)('$desc', (tc) => {
    const got = getSemesterHourFromCourseCode(tc.course);
    expect(got).toBe(tc.wantResult);
  });
});

describe('generateSemesters', () => {
  const testCases: {
    desc: string;
    count: number;
    startYear: number;
    startSemester: SemesterType;
    includeSummer: boolean;
    want: Pick<Semester, 'code'>[];
  }[] = [
    {
      desc: '3 semesters starting in Fall 2000',
      count: 3,
      startYear: 2000,
      includeSummer: true,
      startSemester: SemesterType.f,
      want: [
        { code: { semester: SemesterType.f, year: 2000 } },
        { code: { semester: SemesterType.s, year: 2001 } },
        { code: { semester: SemesterType.u, year: 2001 } },
      ],
    },
    {
      desc: '3 semesters starting in Spring 2000',
      count: 3,
      startYear: 2000,
      includeSummer: true,
      startSemester: SemesterType.s,
      want: [
        { code: { semester: SemesterType.s, year: 2000 } },
        { code: { semester: SemesterType.u, year: 2000 } },
        { code: { semester: SemesterType.f, year: 2000 } },
      ],
    },
    {
      desc: '3 semesters starting in Summer 2000',
      count: 3,
      startYear: 2000,
      includeSummer: true,
      startSemester: SemesterType.u,
      want: [
        { code: { semester: SemesterType.u, year: 2000 } },
        { code: { semester: SemesterType.f, year: 2000 } },
        { code: { semester: SemesterType.s, year: 2001 } },
      ],
    },
    {
      desc: '3 semesters starting in Fall 2000 excluding summer',
      count: 3,
      startYear: 2000,
      includeSummer: false,
      startSemester: SemesterType.f,
      want: [
        { code: { semester: SemesterType.f, year: 2000 } },
        { code: { semester: SemesterType.s, year: 2001 } },
        { code: { semester: SemesterType.f, year: 2001 } },
      ],
    },
  ];

  test.each(testCases)('$desc', (tc) => {
    const got = generateSemesters(tc.count, tc.startYear, tc.startSemester, tc.includeSummer);
    expect(got).toMatchObject(tc.want);
  });
});
