import { createAction } from "@reduxjs/toolkit";

/**
 * Action type to load all available courses.
 */
export const LOAD_COURSES = 'LOAD_COURSES';

/**
 * Action type to load all catalogs.
 */
export const LOAD_CATALOG = 'LOAD_CATALOGS'

/**
 * Action type to update course content;
 */
export const UPDATE_COURSES = 'UPDATE_COURSES';

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


export const loadCatalog = createAction(LOAD_CATALOG);

export const loadRequirements = createAction('LOAD_REQUIREMENTS');
