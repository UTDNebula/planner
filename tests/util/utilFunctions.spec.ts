import { describe, expect, test } from '@jest/globals';
import {
  createNewSemesterCode,
  createSemesterCodeRange,
  createYearBasedOnFall,
  generateSemesters,
  getSemesterHourFromCourseCode,
} from '../../src/utils/utilFunctions';
import { Semester } from '@/components/planner/types';
import { SemesterType } from '@prisma/client';
import { SemesterCode } from 'prisma/utils';

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

describe('createNewSemesterCode', () => {
  const testCases: { desc: string; input: SemesterCode; want: SemesterCode }[] = [
    {
      desc: 'Create semester following Fall 2000',
      input: {
        semester: 'f',
        year: 2000,
      },
      want: {
        semester: 's',
        year: 2001,
      },
    },
    {
      desc: 'Create semester following Spring 2000',
      input: {
        semester: 's',
        year: 2000,
      },
      want: {
        semester: 'u',
        year: 2000,
      },
    },
    {
      desc: 'Create semester following Summer 2000',
      input: {
        semester: 'u',
        year: 2000,
      },
      want: {
        semester: 'f',
        year: 2000,
      },
    },
  ];

  test.each(testCases)('$desc', (tc) => {
    const got = createNewSemesterCode(tc.input);
    expect(got).toMatchObject(tc.want);
  });
});

describe('createSemesterCodeRange', () => {
  const testCases: {
    desc: string;
    startSemester: SemesterCode;
    endSemester: SemesterCode;
    includeEnd: boolean;
    includeStart: boolean;
    want: SemesterCode[];
  }[] = [
    {
      desc: 'Create semester from Fall 2000 to Summer 2002 (inclusive on both ends)',
      startSemester: {
        semester: 'f',
        year: 2000,
      },
      endSemester: {
        semester: 'u',
        year: 2002,
      },
      includeEnd: true,
      includeStart: true,
      want: [
        { semester: 'f', year: 2000 },
        { semester: 's', year: 2001 },
        { semester: 'u', year: 2001 },
        { semester: 'f', year: 2001 },
        { semester: 's', year: 2002 },
        { semester: 'u', year: 2002 },
      ],
    },
    {
      desc: 'Create semester from Fall 2000 to Summer 2002 (inclusive on start but not end)',
      startSemester: {
        semester: 'f',
        year: 2000,
      },
      endSemester: {
        semester: 'u',
        year: 2002,
      },
      includeEnd: false,
      includeStart: true,
      want: [
        { semester: 'f', year: 2000 },
        { semester: 's', year: 2001 },
        { semester: 'u', year: 2001 },
        { semester: 'f', year: 2001 },
        { semester: 's', year: 2002 },
      ],
    },
    {
      desc: 'Create semester from Fall 2000 to Summer 2002 (inclusive on end but not start)',
      startSemester: {
        semester: 'f',
        year: 2000,
      },
      endSemester: {
        semester: 'u',
        year: 2002,
      },
      includeEnd: true,
      includeStart: false,
      want: [
        { semester: 's', year: 2001 },
        { semester: 'u', year: 2001 },
        { semester: 'f', year: 2001 },
        { semester: 's', year: 2002 },
        { semester: 'u', year: 2002 },
      ],
    },
  ];

  test.each(testCases)('$desc', (tc) => {
    const got = createSemesterCodeRange(
      tc.startSemester,
      tc.endSemester,
      tc.includeEnd,
      tc.includeStart,
    );
    expect(got).toMatchObject(tc.want);
  });
});
