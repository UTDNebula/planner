import { SemesterCode } from '../../lib/types';
/**
 * The basic building block for a schedule.
 */
export interface Course {
  /**
   * A unique identifier for this course.
   */
  id: string;

  /**
   * The official long name of this course, such as "Computer Architecture".
   */
  fullName: string;

  /**
   * When this course may be taken.
   */
  offered: Array<string>; // TODO: Remove once temp schedules are removed

  /**
   * An official catalog-provided user-readable description of this course.
   */
  description: string;

  /**
   * The subject code of this course, like "CS".
   */
  subject: string;

  /**
   * The course "number", like 1200, 4V98.
   */
  suffix: string;

  /**
   * An optional map of IDs for courses and minimum grades that must be taken
   * before taking this class.
   */
  prerequisites?: {
    [courseCode: string]: any;
  };

  /**
   * An optional map of IDs for courses and minimum grades that must be taken
   * before or concurrently with this class.
   */
  corequisites?: {
    [courseCode: string]: any;
  };
}
