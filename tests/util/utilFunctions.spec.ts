import { describe, expect, test, jest, afterEach } from '@jest/globals';
import { SemesterType } from '@prisma/client';

import { Semester } from '@/components/planner/types';
import { SemesterCode } from '@/../prisma/utils';

import {
  createNewSemesterCode,
  createSemesterCodeRange,
  createYearBasedOnFall,
  generateSemesters,
  getSemesterHourFromCourseCode,
  getStartingPlanSemester,
  isEarlierSemester,
} from '../../src/utils/utilFunctions';

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

describe('isEarlierSemester', () => {
  const testCases: { desc: string; s1: SemesterCode; s2: SemesterCode; want: boolean }[] = [
    {
      desc: 's1 year is earlier than s2 year but same semester',
      s1: {
        semester: 'f',
        year: 1999,
      },
      s2: {
        semester: 'f',
        year: 2000,
      },
      want: true,
    },
    {
      desc: 'in the same year, Spring < Summer',
      s1: {
        semester: 's',
        year: 2000,
      },
      s2: {
        semester: 'u',
        year: 2000,
      },
      want: true,
    },
    {
      desc: 'in the same year, Summer < Fall',
      s1: {
        semester: 'u',
        year: 2000,
      },
      s2: {
        semester: 'f',
        year: 2000,
      },
      want: true,
    },
    {
      desc: 'equal semester and year',
      s1: {
        semester: 'f',
        year: 2000,
      },
      s2: {
        semester: 'f',
        year: 2000,
      },
      want: false,
    },
  ];

  test.each(testCases)('$desc', (tc) => {
    const got = isEarlierSemester(tc.s1, tc.s2);
    expect(got).toBe(tc.want);
  });
});

describe('getStartingPlanSemester', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  const testCases: {
    desc: string;
    fakeDate: Date;
    want: SemesterCode;
  }[] = [
    {
      desc: 'one second until Jane',
      fakeDate: new Date('2000-05-31T23:59:59'),
      want: { year: 2000, semester: 's' },
    },
    {
      desc: 'the second Jane starts',
      fakeDate: new Date('2000-06-01T00:00:00'),
      want: { year: 2000, semester: 'u' },
    },
    {
      desc: 'the second Sep. starts',
      fakeDate: new Date('2000-09-01T00:00:00'),
      want: { year: 2000, semester: 'f' },
    },
  ];

  test.each(testCases)('$desc', (tc) => {
    jest.useFakeTimers({ now: tc.fakeDate });
    const got = getStartingPlanSemester();
    expect(got).toMatchObject(tc.want);
  });
});
