import { SemesterCode } from '@prisma/client';

import { createNewYear, displaySemesterCode, isSemCodeEqual } from './utilFunctions';

export interface RecentSemester {
  year: number;
  semester: SemesterCode;
}

// const dummySemesters: Semester[] = [
//   {
//     title: 'Fall 2022',
//     code: '2022f',
//     courses: [],
//   },
//   {
//     title: 'Spring 2023',
//     code: '2023s',
//     courses: [],
//   },
//   {
//     title: 'Fall 2023',
//     code: '2023f',
//     courses: [],
//   },
//   {
//     title: 'Spring 2024',
//     code: '2024s',
//     courses: [],
//   },
//   {
//     title: 'Fall 2024',
//     code: '2024f',
//     courses: [],
//   },
//   {
//     title: 'Spring 2025',
//     code: '2025s',
//     courses: [],
//   },
//   {
//     title: 'Fall 2025',
//     code: '2025f',
//     courses: [],
//   },
//   {
//     title: 'Spring 2026',
//     code: '2026s',
//     courses: [],
//   },
// ];

// export const dummyPlan: StudentPlan = {
//   id: uuid(),
//   title: 'Empty Template',
//   major: 'Major (Change in settings',
//   semesters: dummySemesters,
// };

/**
 * Move the item at the given start index to the given end index.
 *
 * @param courses The semester to reorder
 * @param startIndex The starting index of the item to move
 * @param endIndex The destination index of the item to move
 */
export function reorderSemester(courses: string[], startIndex: number, endIndex: number): string[] {
  const result = Array.from(courses);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

export function reorderList<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export function formatDegreeValidationRequest(
  semesters: { code: SemesterCode; id: string; courses: string[] }[],
  transferCredits: string[],
  requirements = { core: true, majors: ['computer_science'], minors: [] },
  bypasses: string[] = [],
) {
  return {
    courses: [...semesters.flatMap((s) => s.courses), ...transferCredits],
    requirements: requirements,
    bypasses,
  };
}

export function addCreditsToPlan(
  semesters: { code: SemesterCode; id: string; courses: string[]; planId: string | null }[],
  creditsData: { courseCode: string; semesterCode: SemesterCode | null }[],
  planId: string,
) {
  // Calculate # years to add
  // Bug: ignores credits transferred in
  let minYear = 10000000;
  creditsData.forEach((credit) => {
    if (credit.semesterCode) {
      if (credit.semesterCode?.semester === 'f') {
        minYear = Math.min(credit.semesterCode.year, minYear);
      } else {
        minYear = Math.min(credit.semesterCode.year - 1, minYear);
      }
    }
  });
  // Add credit years to plan
  let creditSemesters: {
    courses: string[];
    id: string;
    code: SemesterCode;
    planId: string | null;
  }[] = [];

  const endSemester = semesters[0] ? semesters[0].code.year : 2022;

  for (let year = minYear; year < endSemester; year++) {
    const newYear = createNewYear({ semester: 'u', year }).map((sem) => {
      return { ...sem, courses: [] as string[], id: displaySemesterCode(sem.code) };
    });

    // Add credits to year
    newYear.forEach((sem) => {
      creditsData.map((credit) => {
        if (
          credit.semesterCode &&
          credit.semesterCode.semester === sem.code.semester &&
          credit.semesterCode.year === sem.code.year
        ) {
          sem.courses.push(credit.courseCode);
        }
      });
      creditSemesters.push({ ...sem, planId });
    });
  }

  // Remove extra semester if needed
  creditSemesters = creditSemesters.filter((sem) => isEarlierSemester(sem.code, semesters[0].code));
  const newSem = creditSemesters.concat(semesters);
  return newSem;
}

/**
 * Is semesterOne earlier than semesterTwo
 */
export const isEarlierSemester = (semesterOne: SemesterCode, semesterTwo: SemesterCode) => {
  if (isSemCodeEqual(semesterOne, semesterTwo)) {
    return false;
  } else if (semesterOne.year > semesterTwo.year) {
    return false;
  } else if (
    semesterOne.year === semesterTwo.year &&
    (semesterOne.semester === 'f' || (semesterOne.semester === 'u' && semesterTwo.semester === 's'))
  ) {
    return false;
  }
  return true;
};

export const getStartingPlanSemester = (): SemesterCode => {
  const d = new Date();
  if (d.getMonth() < 5) {
    return { year: d.getFullYear(), semester: 's' };
  } else if (d.getMonth() > 7) {
    return { year: d.getFullYear(), semester: 'f' };
  } else {
    return { year: d.getFullYear(), semester: 'u' };
  }
};
