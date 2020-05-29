
export const ADD_COURSE = 'ADD_COURSE';

export const CREATE_SCHEDULE = 'CREATE_SCHEDULE';

export const ADD_SEMESTER = 'ADD_SEMESTER';

export const MOVE_COURSE = 'MOVE_COURSE';

export const REMOVE_COURSE = 'REMOVE_COURSE';

export const MOVE_SEMESTER = 'MOVE_SEMESTER';

export const REMOVE_SEMESTER = 'REMOVE_SEMESTER';

/**
 * @typedef ScheduleAction
 * @property {Action} type
 * @property {object} payload
 */

/**
 * Delete a user's schedule.
 */
export const DELETE_SCHEDULE = 'DELETE_SCHEDULE';

/**
 * Modify schedule metadata.
 */
export const UPDATE_SCHEDULE = 'UPDATE_SCHEDULE';

/**
 * A
 *
 * @readonly
 * @typedef {string} Action
 * @enum {Action}
 */
// eslint-disable-next-line no-unused-vars
const ACTIONS = {
  ADD_COURSE,
  CREATE_SCHEDULE,
  DELETE_SCHEDULE,
  UPDATE_SCHEDULE,
};

/**
 * Persist local changes to remote data store.
 */
export const SAVE_SCHEDULE = 'SAVE_SCHEDULE';


/**
 * Update a position of the course
 *
 * @param {string} scheduleId The ID of the schedule to modify
 * @param {number} start The term the course is originally in
 * @param {string} end The desired term to move the course
 */
export function moveCourse(scheduleId, courseId, start, end) {
  return {
    type: MOVE_COURSE,
    payload: {
      scheduleId,
      courseId,
      start,
      end,
    },
  };
}

export function removeCourse(scheduleId, semester, courseId) {
  return {
    type: REMOVE_COURSE,
    payload: {
      semester,
      courseId,
    },
  };
}

/**
 * 
 * @param {Schedule} schedule The schedule to save
 * @param {string} id The ID of the existing schedule
 */
export function saveSchedule(schedule, id) {
  return {
    type: SAVE_SCHEDULE,
    payload: {
      schedule,
      id,
    },
  };
}