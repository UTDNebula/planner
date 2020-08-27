import {
  YearClassification,
  CourseAttempt,
  ScheduleSemester,
  PlanRequirement,
} from '../../lib/types';

/**
 * A wrapper for student data.
 *
 * A student can own one or more schedules. This object keeps track of a
 * student's attempted courses and provides some fields for quick querying.
 */
export interface Student {
  id: string;

  /**
   * The user's full name.
   */
  name: string;

  /**
   * When this student first enrolled in classes.
   */
  startTerm: string;

  /**
   * Anticipated or actual term of graduation
   */
  endTerm: string;

  /**
   * The registrar-determined year.
   */
  classification: YearClassification;

  /**
   * The amount of attempted credit hours.
   */
  attemptedCreditHours: number;

  /**
   * The current grade point average.
   */
  gpa: number;

  /**
   * All a student's course attempts and letter grades.
   * /students/:id/attempts
   */
  attemptedCourses: Array<CourseAttempt>;

  /**
   * A list of all required courses this student must take to graduate.
   */
  requirements: Array<string>;

  /**
   * The IDs of the CoursePlans being attempted.
   */
  plans: Array<string>;
}

export interface StudentData {
  id: string;

  name: string;

  startTerm: string;

  endTerm: string;

  classification: string;

  attemptedCreditHours: number;

  gpa: number;

  email: string;

  picture: string;

  attemptedCourses: CourseAttempt[];

  requirements: PlanRequirement[];
}

export interface ScheduleData {
  id: string;
  name: string;
  owner: string;
  created: string;
  lastUpdated: string;
}

/**
 * A schedule containing courses grouped into semesters.
 */

export interface Schedule {
  id: string;

  /**
   * A user-defined title.
   */
  name: string;

  /**
   * The student ID of this schedule's owner.
   */
  owner: string;

  /**
   * A timestamp denoting when this schedule was first created.
   */
  created: string;

  /**
   * A timestamp denoting when this schedule was last saved.
   */
  lastUpdated: string;

  /**
   * The semesters that contain this schedule's courses.
   */
  semesters: Array<ScheduleSemester>;
}
