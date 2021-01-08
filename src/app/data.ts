/**
 * A topic of study.
 */
export interface Course {
  id: string;
  title: string;
  catalogCode: string;
  description: string;
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
  'f' = 0,
  's' = 1,
  'u' = 2,
}

/**
 * A grade received for a course, used for record-keeping.
 */
export type Grade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'D-' | 'F' | 'CR' | 'NC' | 'P' | 'NR' | 'I';

/**
 * A value of -1 indicates the course for which the letter grade was recieved
 * should not have its attmpted hours used in GPA calculations.
 */
export const GPA_MAPPINGS: { [key in Grade]: number } = {
  'A+': 4.00,
  'A': 4.00,
  'A-': 3.666,
  'B+': 3.333,
  'B': 3.000,
  'B-': 2.666,
  'C+': 2.333,
  'C': 2.000,
  'C-': 1.333,
  'D+': 1.000,
  'D': 0.666,
  'D-': 0.333,
  'F': 0,
  'CR': -1,
  'NC': -1,
  'P': -1,
  'NR': -1,
  'I': -1,
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
export function generateCourses(amount: number = 5): Course[] {
  const courses = [];
  for (let i = 0; i < amount; ++i) {
    const id = Math.floor(Math.random() * (5000 - 1000) + 1000);
    courses.push({
      id: id.toString(),
      title: 'A course with a code.',
      catalogCode: `CS ${id}`,
      description: 'Just another course. What can we say?',
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
): StudentPlan {

  function generateSemesters(onlyLong: boolean = true): Semester[] {
    const result = [];
    let semester = startSemester;
    let year = startYear;
    for (let i = 0; i < semesterCount; ++i) {
      const code = `${year}${semester}`;
      const newSemester = {
        title: `${SEMESTER_CODE_MAPPINGS[semester]} ${year} `,
        code: code,
        courses: generateCourses(),
      };
      result.push(newSemester);
      if (semester === SemesterCode.f) {
        year = year + 1;
        semester = SemesterCode.s;
      } else { // Semester code is either spring or summer
        if (onlyLong || semester === SemesterCode.s) {
          semester = SemesterCode.f;
        } else {
          semester = SemesterCode.u;
        }
      }
    }
    return result;
  }

  const plan = {
    id: planId,
    title: title,
    major: major,
    semesters: generateSemesters(),
  };
  return plan;
}
