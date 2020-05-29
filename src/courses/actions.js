// Action types
export const FILTER_COURSES = 'FILTER_COURSES';

/**
 * Search parameters for filtering courses.
 *
 * @typedef {object} FilterParams
 * @property {string=} title The formal title of the course
 * @property {string=} number The course number
 * @property {string=} subject The subject code for a course
 * @property {import('../lib/types').SemesterCode} semester When a course is offered
 */

/**
 * Search courses by given parameters.
 *
 * @param {FilterParams} params Options used to filter courses
 */
export function filterCourses(params) {
  return {
    type: FILTER_COURSES,
    params: params,
  };
}