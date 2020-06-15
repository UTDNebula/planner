import { Dispatch } from 'redux';
import { CourseAttempt, Schedule } from '../lib/types';
import { fetchStudent } from '../lib/api';

export const LOAD_USER_DATA = 'LOAD_USER';
export const UPDATE_USER = 'UPDATE_USER';
export const ADD_SCHEDULE = 'ADD_SCHEDULE';
export const DELETE_SCHEDULE = 'DELETE_SCHEDULE';

export interface StudentData {
  name: string;
  attemptedCourses: Array<CourseAttempt>;
}

interface LoadUserDataAction {
  type: typeof LOAD_USER_DATA;

  /**
   * The ID of the user to load data.
   */
  payload: string;
}

interface UpdateStudentDataAction {
  type: typeof UPDATE_USER;
  payload: StudentData;
}

interface AddScheduleAction {
  type: typeof ADD_SCHEDULE;
  payload: Schedule;
}

interface DeleteScheduleAction {
  type: typeof DELETE_SCHEDULE;
  payload: string;
}

export type UserDataActionType = LoadUserDataAction | UpdateStudentDataAction | AddScheduleAction | DeleteScheduleAction;

export function requestUserData(userId: string): UserDataActionType {
  return {
    type: LOAD_USER_DATA,
    payload: userId,
  }
}

export function updateUserData(user: StudentData): UserDataActionType {
  return {
    type: UPDATE_USER,
    payload: user,
  };
}


export function getUserData(userId: string) {
  return async (dispatch: Dispatch) => {
    // TODO: Determine where to cache data
    try {
      const userData = fetchStudent(userId); 
      // Mark current data invalid
      dispatch(updateUserData(userData));
    } catch (e) {
      throw e;
    }
  }
}