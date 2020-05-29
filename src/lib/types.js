/**
 * Type definitions and constants for project-wide objects.
 */

/**
 * The basic building block for a schedule.
 *
 * @typedef {object} Course
 * @property {string} fullName The official long name of this course, such as "Computer Architecture"
 * @property {Array<SemesterCode>} offered When this course may be taken
 * @property {string} description An official catalog-provided user-readable description of this course
 * @property {SubjectCode} subject The subject code of this course, like "CS"
 * @property {string} suffix The course "number", like 1200, 4V98
 * @property {Map<string, Grade>?} prerequisites An optional map of IDs for courses and minimum grades that must be taken before taking this class
 * @property {Map<string, Grade>?} corequisites An optional map of IDs for courses and minimum grades that must be taken before or concurrently with this class
 */

/**
 * 
 * @typedef {object} Schedule
 * @property {string} name A user-defined title
 * @property {string} owner The student ID of this schedule's owner
 * @property {string} created A timestamp denoting when this schedule was first created
 * @property {string} lastUpdated A timestamp denoting when this schedule was last saved
 * @property {Array<ScheduleSemester>} semesters The semesters that contain this schedule's courses
 */

/**
 * A wrapper for degree plan information used to validate a four-year plan.
 *
 * Stores all the requirements for a particular degree plan. For example, this
 * would store all information on how to graduate with a Bachelor of Science in
 * Comuter Science.
 *
 * @typedef {object} CoursePlan
 * @property {string} name The subject of the plan, such as "Computer Science"
 * @property {PlanType} type The formal type, such as "Bachelor of Science"
 * @property {PlanCategory?} category The category of plan
 * @property {Array<PlanRequirement>} requirements All required courses for this plan
 */

/**
 * A wrapper for student data.
 * 
 * A student can own one or more schedules. This object keeps track of a
 * student's attempted courses and provides some fields for quick querying.
 * 
 * @typedef {object} Student
 * @property {string} name The user's full name
 * @property {Term} startTerm When this student first enrolled in classes 
 * @property {Term} endTerm Anticipated or actual term of graduation
 * @property {Classification} classification The registrar-determined year
 * @property {number} attemptedCreditHours The amount of attempted credit hours
 * @property {number} gpa The current grade point average
 * @property {Array<CourseAttempt>} attemptedCourses All a student's course attempts and letter grades
 * @property {Array<string>} plans The IDs of the CoursePlans being attempted 
 */

/**
 * Used to keep track of a specific instance of a student course performance.
 *
 * Note: There may be multiple instances of the same course in a student record.
 *
 * @typedef {object} CourseAttempt
 * @property {string} course Name of course taken
 * @property {Grade} grade Letter grade of course
 * @property {Term} term The specific semester this course was taken 
 */


/**
 * A collection of courses to be taken in a semester.
 * 
 * Used in schedule planning.
 * 
 * @typedef {object} ScheduleSemester
 * @property {Term} term When these courses will be taken
 * @property {Array<Course>} courses The planned courses to enroll in this semester
 */

/**
 * A grouping of courses required to satisfy a degree requirements.
 *
 * @typedef {object} PlanRequirement
 * @property {string} name The formal title of this requirement, like "Major Preparatory Courses"
 * @property {Array<String>} courses A list of required course IDs to satisfy this requirement
 */

/**
 * The registrar-determined year classification based on credit hours.
 *
 * @typedef {string} YearClassification
 * @readonly
 * @enum {string}
 */
export const CLASSIFICATIONS = {
  'fr': 'freshman',
  'so': 'sophomore',
  'ju': 'junior',
  'se': 'senior',
  'gr': 'graduate',
};

/**
 * A course's subject code.
 *
 * @typedef {string} SubjectCode
 * @readonly
 * @enum {string}
 */
export const SUBJECT_CODES = {
  'CS': 'Computer Science',
  'MATH': 'Mathematics',
  // TODO: Add rest of subject code mappings
};

/**
 * A letter grade with an associated number of grade points.
 * 
 * Grades with values of -1 should not be factored into GPA calculations.
 *
 * @typedef {string} Grade
 * @readonly
 * @enum {number}
 */
export const GRADES = {
  'A+': 4.000,
  'A': 4.000,
  'A-': 3.670,
  'B+': 3.330,
  'B': 3.000,
  // TOOD: Insert rest of grades
  'F': 0.000,
  /**
   * Indicates credit was not recieved for a course, only used in undergraduate
   * courses.
   * This grade should not be factored into GPA calculations.
   */
  'NC': -1,
  /**
   * Indicates credit was recieved for a course, only used in undergraduate
   * courses.
   * This grade should not be factored into GPA calculations.
   */
  'CR': -1,
  /**
   * Indicates course requirements were not complete at the end of a semester.
   * This grade should not be factored into GPA calculations.
   */
  'I': -1,
  /**
   * Indicates a passing grade, only used in graduate courses.
   * This grade should not be factored into GPA calculations.
   */
  'P': -1,
  'W': -1,
  'WL': -1,
  'NR': -1,
};

/**
 * The season of a semester.
 *
 * @typedef {string} SemesterCode
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
 * A specific semester term.
 * Must be foramtted [year][SemesterCode].
 *
 * @typedef {string} Term
 * @example
 *    2020f
 */

/**
 * What shows up on the diploma.
 *
 * @typedef {string} PlanType
 * @readonly
 * @enum {string}
 * @example
 *  BS
 */
export const PLAN_TYPES = {
  'BS': 'Bachelor of Science',
  'BA': 'Bachelor of Arts',
  // TODO: Add rest of degrees
};

/**
 * A category of degree plan.
 * 
 * Only used for undergraduate degrees.
 *
 * @typedef {string} PlanCategory
 * @readonly
 * @enum {string}
 */
export const PLAN_CATEGORIES = {
  'major': 'Major',
  'minor': 'Minor',
  'honors': 'Honors',
  'cert': 'Certificate',
};