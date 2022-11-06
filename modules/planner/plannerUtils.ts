import { v4 as uuid } from 'uuid';

import { RecentSemester } from '../../components/planner/PlannerContainer';
import DUMMY_PLAN from '../../data/add_courses.json';
import { Semester, SemesterCode, StudentPlan } from '../common/data';

// Initial value for plan until data is properly loaded
export const initialPlan: StudentPlan = {
  id: 'empty-plan',
  title: 'Just a Degree Plan',
  major: 'Computer Science',
  semesters: DUMMY_PLAN,
};

const dummySemesters: Semester[] = [
  {
    title: 'Fall 2022',
    code: '2022f',
    courses: [],
  },
  {
    title: 'Spring 2023',
    code: '2023s',
    courses: [],
  },
  {
    title: 'Fall 2023',
    code: '2023f',
    courses: [],
  },
  {
    title: 'Spring 2024',
    code: '2024s',
    courses: [],
  },
  {
    title: 'Fall 2024',
    code: '2024f',
    courses: [],
  },
  {
    title: 'Spring 2025',
    code: '2025s',
    courses: [],
  },
  {
    title: 'Fall 2025',
    code: '2025f',
    courses: [],
  },
  {
    title: 'Spring 2026',
    code: '2026s',
    courses: [],
  },
];

export const dummyPlan: StudentPlan = {
  id: uuid(),
  title: 'Empty Template',
  major: 'Major (Change in settings',
  semesters: dummySemesters,
};

/**
 * This function generates the metadata needed
 * create a new semester inside the user plan
 * @param semesters Array of semesters obtained from the user plan
 * @returns metatdata to create a new semester
 */
export function getRecentSemesterMetadata(semesters: Semester[]) {
  const lastSemester: Semester = semesters[semesters.length - 1];
  const recentSemester: RecentSemester = {
    year: parseInt(lastSemester.code.substring(0, lastSemester.code.length - 1)),
    semester: lastSemester.code.substring(lastSemester.code.length - 1) as SemesterCode,
  };
  return recentSemester;
}

/**
 * Generate metadata for adding a new semester.
 *
 * @param isSummer Flag for whether to use summer or fall
 */
export function getUpdatedSemesterData(recentSemesterData: RecentSemester, isSummer = false) {
  const { year, semester } = recentSemesterData;
  let updatedYear;
  let updatedSemester = semester;
  if (semester === SemesterCode.f) {
    updatedYear = year + 1;
    updatedSemester = SemesterCode.s;
  } else {
    // Semester code is either spring or summer
    updatedYear = year;
    if (isSummer && semester === SemesterCode.s) {
      updatedSemester = SemesterCode.u;
    } else {
      updatedSemester = SemesterCode.f;
    }
  }
  return {
    year: updatedYear,
    semester: updatedSemester,
  };
}

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
