import { Course } from '../store/catalog/types';

/**
 * A wrapper for degree plan information used to validate a four-year plan.
 *
 * Stores all the requirements for a particular degree plan. For example, this
 * would store all information on how to graduate with a Bachelor of Science in
 * Comuter Science.
 */
export interface CoursePlan {
  /**
   * The subject of the plan, such as "Computer Science".
   */
  name: string;

  /**
   * The formal type, such as "Bachelor of Science".
   */
  type: string;

  /**
   * The category of plan.
   */
  category: string;

  /**
   * All required courses for this plan.
   */
  requirements: Array<PlanRequirement>;
}

/**
 * Used to keep track of a specific instance of a student course performance.
 *
 * Note: There may be multiple instances of the same course in a student record.
 */
export interface CourseAttempt {
  /**
   * Unique identifier of course taken.
   */
  id: string;

  /**
   * Letter grade received for this course.
   */
  grade: Grade;

  /**
   * The specific semester this course was taken.
   */
  term: Term;
}

/**
 * A collection of courses to be taken in a semester.
 *
 * Used in schedule planning.
 */
export interface ScheduleSemester {
  /**
   * When these courses will be taken.
   */
  term: Term;

  /**
   * The planned courses to enroll in this semester.
   */
  courses: Array<Course>;
}

/**
 * A grouping of courses required to satisfy a degree requirements.
 */
export interface PlanRequirement {
  /**
   * The formal title of this requirement, like "Major Preparatory Courses".
   */
  name: string;

  /**
   * A list of required course IDs to satisfy this requirement.
   */
  courses: Array<Course>;
  // TODO: Store ID instead of whole course
}

/**
 * The registrar-determined year classification based on credit hours.
 */
export type YearClassification = 'fr' | 'so' | 'ju' | 'se' | 'gr';

/**
 * All the valid year classifications.
 *
 * @readonly
 * @enum {string}
 */
export const CLASSIFICATIONS = {
  fr: 'freshman',
  so: 'sophomore',
  ju: 'junior',
  se: 'senior',
  gr: 'graduate',
};

/**
 * A mapping of subject codes to full names.
 *
 * @readonly
 * @enum {string}
 */
export const SUBJECT_CODES = {
  CS: 'Computer Science',
  MATH: 'Mathematics',
  // TODO: Add rest of subject code mappings
};

/**
 * A courses's subject code.
 */
export type SubjectCode = 'CS' | 'MATH' | 'PHYS' | 'ECS' | 'RHET' | 'ENGL';

/**
 * Mappings of letter grades to grade points.
 *
 * Grades with values of -1 should not be factored into GPA calculations.
 *
 * @readonly
 * @enum {number}
 */
export enum GradeMappings {
  'A+' = 4.0,
  'A' = 4.0,
  'A-' = 3.67,
  'B+' = 3.33,
  'B' = 3.0,
  // TOOD: Insert rest of grades
  'F' = 0.0,
  /**
   * Indicates credit was not recieved for a course, only used in undergraduate
   * courses.
   * This grade should not be factored into GPA calculations.
   */
  'NC' = -1,
  /**
   * Indicates credit was recieved for a course, only used in undergraduate
   * courses.
   * This grade should not be factored into GPA calculations.
   */
  'CR' = -1,
  /**
   * Indicates course requirements were not complete at the end of a semester.
   * This grade should not be factored into GPA calculations.
   */
  'I' = -1,
  /**
   * Indicates a passing grade, only used in graduate courses.
   * This grade should not be factored into GPA calculations.
   */
  'P' = -1,
  'W' = -1,
  'WL' = -1,
  'NR' = -1,
}

/**
 * A letter grade with an associated number of grade points.
 *
 * @typedef {string} Grade
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
  | 'NC'
  | 'CR'
  | 'I'
  | 'P'
  | 'W'
  | 'WL'
  | 'NR';

/**
 * All valid semester codes.
 *
 * @readonly
 * @enum {string}
 */
export const SEMESTER_CODES = {
  /**
   * Fall term
   */
  FALL: 'f',
  /**
   * Spring term
   */
  SPRING: 's',
  /**
   * Summer term
   */
  SUMMER: 'u',
};

/**
 * The season of a semester.
 */
export type SemesterCode = 'f' | 's' | 'u';

/**
 * A specific semester term.
 * Should be foramtted [year][SemesterCode].
 *
 * @example
 *    2020f
 */
export type Term = string;

/**
 * What shows up on the diploma.
 *
 * @readonly
 * @enum {string}
 * @example
 *  BS
 */
export const PLAN_TYPES = {
  BS: 'Bachelor of Science',
  BA: 'Bachelor of Arts',
  // TODO: Add rest of degrees
};

/**
 *
 * @readonly
 * @enum {string}
 */
export const PLAN_CATEGORIES = {
  major: 'Major',
  minor: 'Minor',
  honors: 'Honors',
  cert: 'Certificate',
};

/**
 * A category of degree plan.
 *
 * Only used for undergraduate degrees.
 *
 * @typedef {string} PlanCategory
 */
export type PlanCategory = 'major' | 'minor' | 'honors' | 'cert';
