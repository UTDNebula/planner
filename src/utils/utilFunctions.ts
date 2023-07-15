import { SemesterType } from '@prisma/client';
import { SemesterCode } from 'prisma/utils';
import { UUID } from 'bson';

import { Semester } from '@/components/planner/types';
import { isEarlierSemester } from './plannerUtils';
import { tagColors } from '@/components/planner/utils';

/**
 * Creates 3 new semesters based on given Fall year.
 * Ex. 2012 -> Fall 2012, Spring 2013, Summer 2013
 * @param semesterCode
 * @returns
 */
export const createYearBasedOnFall = (fallYear: number): Semester[] => {
  const newYear = fallYear + 1;

  return [
    {
      code: {
        semester: 'f' as SemesterType,
        year: fallYear,
      },
      id: new UUID(),
      courses: [],
      color: '',
      locked: false,
    },
    {
      code: {
        semester: 's' as SemesterType,
        year: newYear,
      },
      id: new UUID(),
      courses: [],
      color: '',
      locked: false,
    },
    {
      code: {
        semester: 'u' as SemesterType,
        year: newYear,
      },
      id: new UUID(),
      courses: [],
      color: '',
      locked: false,
    },
  ];
};

// TODO: Write way to load data from API

export type JSONCourseType = {
  id: number;
  name: string;
  hours: string;
  description: string;
  inclass: string;
  outclass: string;
  period: string;
  prerequisites: string[];
};

/**
 * Get the semester hour from course code
 *
 * HIST 1301 -> 3
 * */
export function getSemesterHourFromCourseCode(code: string): number | null {
  const [_, hours]: (string | undefined)[] = code.split(' ');

  const hoursNum = Number(hours);

  if (Number.isNaN(hoursNum) || hoursNum.toString().length < 2) return null;

  return Number(hoursNum.toString()[1]);
}

// TODO(akevinge): Improve enum naming and remove this.
export function displaySemesterCode(semesterCode: SemesterCode): string {
  let semesterName;
  if (semesterCode.semester === 'f') {
    semesterName = 'Fall';
  } else if (semesterCode.semester === 's') semesterName = 'Spring';
  else {
    semesterName = 'Summer';
  }
  return `${semesterName} ${semesterCode.year}`;
}

/**
 * Generates ``count`` number of semesters starting from ``startYear`` and ``startSemester`` (inclusive).
 */
export function generateSemesters(
  count: number,
  startYear: number,
  startSemester: SemesterType,
  includeSummer = true,
): Semester[] {
  const result = [];
  let semester = startSemester;
  let year = startYear;
  for (let i = 0; i < count; ++i) {
    const code = { year, semester };
    const newSemester = {
      id: new UUID(),
      title: `${displaySemesterCode({ semester, year })}`,
      code: code,
      courses: [],
      color: '' as keyof typeof tagColors,
      locked: false,
    };
    result.push(newSemester);
    if (semester === SemesterType.f) {
      year = year + 1;
      semester = SemesterType.s;
    } else if (semester === SemesterType.s && includeSummer) {
      semester = SemesterType.u;
    } else {
      semester = SemesterType.f;
    }
  }

  return result;
}

/**
 * Generates semester following the given one.
 */
export function createNewSemesterCode(pastSemesterCode: SemesterCode): SemesterCode {
  if (pastSemesterCode.semester === 'f') {
    return { semester: 's', year: pastSemesterCode.year + 1 };
  } else if (pastSemesterCode.semester === 's') {
    return { semester: 'u', year: pastSemesterCode.year };
  } else {
    return { semester: 'f', year: pastSemesterCode.year };
  }
}

/**
 * Generates an array of semesters given the ``startSemester`` and ``endSemester``.
 */
export function createSemesterCodeRange(
  startSemester: SemesterCode,
  endSemester: SemesterCode,
  includeEnd: boolean,
  includeStart = true,
) {
  const semesterCodes = includeStart ? [startSemester] : [];
  let currSemester = createNewSemesterCode(startSemester);
  while (isEarlierSemester(currSemester, endSemester)) {
    semesterCodes.push(currSemester);

    currSemester = createNewSemesterCode(currSemester);
  }
  semesterCodes.push(endSemester);

  if (!includeEnd) {
    return semesterCodes.slice(0, semesterCodes.length - 1);
  }
  return semesterCodes;
}

/**
 * Returns true if two semesters are equal (i.e. year and semester type).
 */
export function isSemCodeEqual(semCodeOne: SemesterCode, semCodeTwo: SemesterCode) {
  return semCodeOne.semester === semCodeTwo.semester && semCodeOne.year === semCodeTwo.year;
}

const regex =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const isValidEmail = (email: string) => {
  return regex.test(email);
};
