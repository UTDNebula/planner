import { SemesterCode } from "../lib/types";

export const ADD_COURSE = 'ADD_COURSE';

export const CREATE_SCHEDULE = 'CREATE_SCHEDULE';

export const ADD_SEMESTER = 'ADD_SEMESTER';

export const MOVE_COURSE = 'MOVE_COURSE';

export const REMOVE_COURSE = 'REMOVE_COURSE';

export const MOVE_SEMESTER = 'MOVE_SEMESTER';

export const REMOVE_SEMESTER = 'REMOVE_SEMESTER';

/**
 * @typedef ScheduleAction
 * @param {Action} type
 * @param {object} payload
 */
// interface ScheduleAction {
//   type: string;
//   payload: 
// }

/**
 * Delete a user's schedule.
 */
export const DELETE_SCHEDULE = 'DELETE_SCHEDULE';

/**
 * Modify schedule metadata.
 */
export const UPDATE_SCHEDULE = 'UPDATE_SCHEDULE';

/**
 * All actions
 */
// eslint-disable-next-line no-unused-vars
enum Action {
  ADD_COURSE,
  CREATE_SCHEDULE,
  DELETE_SCHEDULE,
  UPDATE_SCHEDULE,
}

/**
 * Persist local changes to remote data store.
 */
export const SAVE_SCHEDULE = 'SAVE_SCHEDULE';


export function addCourse(scheduleId: string, courseId: string, location: number) {
  return {
    type: ADD_COURSE,
    payload: {
      scheduleId,
      courseId,
      location,
    },
  };
}

/**
 * Update a position of the course
 *
 * @param {string} scheduleId The ID of the schedule to modify
 * @param {number} start The term the course is originally in
 * @param {string} end The desired term to move the course
 */
export function moveCourse(scheduleId: string, courseId: string, start: number, end: number) {
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

export function removeCourse(scheduleId: string, semester: SemesterCode, courseId: string) {
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
export function saveSchedule(schedule: string, id: string) {
  return {
    type: SAVE_SCHEDULE,
    payload: {
      schedule,
      id,
    },
  };
}

export default {
  addCourse,
  moveCourse,
  removeCourse,
  saveSchedule,
};
