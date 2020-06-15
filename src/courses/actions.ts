// Action types
export const LOAD_COURSES = 'LOAD_COURSES';
export const LOAD_CATALOGS = 'LOAD_CATALOGS';
export const FILTER_COURSES = 'FILTER_COURSES';

/**
 * Search parameters for filtering courses.
 *
 * @typedef {object} FilterParams
 * @param {string=} title The formal title of the course
 * @param {string=} number The course number
 * @param {string=} subject The subject code for a course
 * @param {import('../lib/types').SemesterCode} semester When a course is offered
 */
interface FilterParams {
  title: string;
  number: string;
  subject: string;
  semester: string;
};

// /**
//  * Search courses by given parameters.
//  *
//  * @param {FilterParams} params Options used to filter courses
//  */
// export function filterCourses(params: ) {
//   return {
//     type: FILTER_COURSES,
//     params: params,
//   };
// }

export function loadCourses() {
  return {
    type: LOAD_COURSES,
  };
}

export function loadCatalog() {
  return {
    type: LOAD_CATALOGS,
  };
}
