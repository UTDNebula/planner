import { v4 as uuidv4 } from 'uuid';

import { OnboardingFormData } from '../../pages/app/onboarding';
import { HonorsIndicator } from './types';

/**
 * A topic of study.
 */
export interface Course {
  id: string;
  title: string;
  catalogCode: string;
  description: string;
  creditHours: number;
  prerequisites?: string;
  validation?: { isValid: boolean; override: boolean };
}

/**
 * Backing data type for a SemesterBlock.
 */
export interface Semester {
  title: string;
  code: string;
  courses: Course[];
}

/**
 * A user's timeline for degree plan requirements.
 */
export interface StudentPlan {
  id: string;
  title: string;
  major: string;
  semesters: Semester[];
}

/**
 * A season when courses can be taken.
 */
export enum SemesterCode {
  'f' = 'f',
  's' = 's',
  'u' = 'u',
}

/**
 * A grade received for a course, used for record-keeping.
 */
export type Grade =
  | 'A+'
  | 'A'
  | 'A-'
  | 'B+'
  | 'B'
  | 'B-'
  | 'C+'
  | 'C'
  | 'C-'
  | 'D+'
  | 'D'
  | 'D-'
  | 'F'
  | 'CR'
  | 'NC'
  | 'P'
  | 'NR'
  | 'I';

/**
 * A value of -1 indicates the course for which the letter grade was recieved
 * should not have its attmpted hours used in GPA calculations.
 */
export const GPA_MAPPINGS: { [key in Grade]: number } = {
  'A+': 4.0,
  A: 4.0,
  'A-': 3.666,
  'B+': 3.333,
  B: 3.0,
  'B-': 2.666,
  'C+': 2.333,
  C: 2.0,
  'C-': 1.333,
  'D+': 1.0,
  D: 0.666,
  'D-': 0.333,
  F: 0,
  CR: -1,
  NC: -1,
  P: -1,
  NR: -1,
  I: -1,
};

/**
 * A mapping of {@link SemesterCode}s to human-readable titles.
 */
export const SEMESTER_CODE_MAPPINGS = {
  [SemesterCode.f]: 'Fall',
  [SemesterCode.s]: 'Spring',
  [SemesterCode.u]: 'Summer',
};

/**
 * Generate a list of courses.
 *
 * @param amount The count of courses to generate, 5 by default.
 */
export function generateCourses(amount = 5): Course[] {
  const courses = [];
  for (let i = 0; i < amount; ++i) {
    const difficulty = Math.floor(Math.random() * (5 - 1) + 1);
    const finalPart = Math.floor(Math.random() * (10 - 1) + 1);
    const courseNumber =
      1_000 * Math.floor(Math.random() * (5 - 1) + 1) + 100 * difficulty + finalPart;
    courses.push({
      id: uuidv4(),
      title: 'A course with a code.',
      catalogCode: `CS ${courseNumber}`,
      description:
        'Just another course. What can we say? It has a title and a description long enough to be believable.',
      creditHours: Number(courseNumber.toString().slice(1, 2)),
    });
  }
  return courses;
}

/**
 * Generate a test degree plan with sample values.
 *
 * @param semesterCount The number of semesters to generate, 4 by default
 * @param startYear The first semester to create courses, 2020 by default
 * @param startSemester The first semester to create courses, f by default
 * @param title A descriptor for this plan, "My degree plan" by default
 * @param major A name for this plan's major of study, "Computer Science" by default
 * @param planId A sample plan ID, "test-plan" by default
 */
export function createSamplePlan(
  semesterCount = 4,
  planId = 'test-plan',
  startYear = 2020,
  startSemester = SemesterCode.f,
  title = 'My degree plan',
  major = 'Computer Science',
  useRandom = true,
): StudentPlan {
  const plan = {
    id: planId,
    title: title,
    major: major,
    semesters: generateSemesters(semesterCount, startYear, startSemester, useRandom),
  };
  return plan;
}

export function createSampleOnboarding() {
  const data: OnboardingFormData = {
    consent: {
      disclaimer: false,
      analytics: false,
      performance: false,
      personalization: false,
    },
    preferredName: '',
    classification: '',
    future: '',
    plan: { majors: [], minors: [] },
    studentAttributes: { onCampus: false, traditional: false, receivingAid: false },
    prestige: {
      honors: ['none' as HonorsIndicator],
      scholarship: '',
      fastTrack: { major: '', status: false, year: '' },
    },
    credits: [],
  };
  return data;
}

export function generateSemesters(
  count: number,
  startYear: number,
  startSemester: SemesterCode,
  useRandom = false,
  courses: Course[] = [],
  coursesPerSemester = 5,
  onlyLong = true,
): Semester[] {
  const result = [];
  let semester = startSemester;
  let year = startYear;
  for (let i = 0; i < count; ++i) {
    const code = `${year}${semester}`;
    const newSemester = {
      title: `${SEMESTER_CODE_MAPPINGS[semester]} ${year}`,
      code: code,
      courses: useRandom ? generateCourses() : [],
    };
    result.push(newSemester);
    if (semester === SemesterCode.f) {
      year = year + 1;
      semester = SemesterCode.s;
    } else if (semester === SemesterCode.u && onlyLong) {
      semester = SemesterCode.f;
    } else {
      semester = SemesterCode.u;
    }
  }
  let semesterIndex = 0;
  for (const course of courses) {
    const code = `${year}${semester}`;
    const current = result[semesterIndex];
    if (current.courses.length <= coursesPerSemester) {
      current.courses.push(course);
    } else {
      semesterIndex++;
      if (semesterIndex > result.length - 1) {
        result.push({
          title: `${SEMESTER_CODE_MAPPINGS[semester]} ${year}`,
          code: code,
          courses: [course],
        });
        if (semester === SemesterCode.f) {
          year = year + 1;
          semester = SemesterCode.s;
        } else if (semester === SemesterCode.u && onlyLong) {
          semester = SemesterCode.f;
        } else {
          semester = SemesterCode.u;
        }
      }
      result[semesterIndex].courses.push(course);
    }
  }
  return result;
}
