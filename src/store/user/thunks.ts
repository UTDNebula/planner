import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchStudentData, fetchUserSchedules, deleteSchedule } from '../../lib/api';
import { uploadSchedule } from '../../lib/api/schedules';
import { StudentData, Schedule } from './types';
import { addSchedule } from './slices/userSchedulesSlice';
import { AppDispatch, AppState } from '..';


interface UploadSchedulePayload {
  userId: string;
  schedule: Schedule;
}

export const addScheduleToUser = createAsyncThunk(
  'users/uploadSchedule',
  async (payload: UploadSchedulePayload, { dispatch }) => {
    const { userId, schedule } = payload;
    try {
      console.log('New schedule');
      console.log(schedule);
      await uploadSchedule(userId, schedule);
      dispatch(addSchedule({ userId, schedule }));
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
);

/**
 * Load user data for a user with the given ID.
 */
export const fetchUserById = createAsyncThunk(
  'users/loadStudent',
  async (userId: string, { dispatch, getState }) => {
    try {
      const userData = await fetchStudentData(userId);
      return userData;
    } catch (e) {
      throw e;
    }
  }
);

/**
 * Load all the user's current schedules.
 */
export const refreshSchedules = createAsyncThunk(
  'users/loadStudentSchedules',
  async (userId: string, { getState }) => {
    try {
      const schedules = await fetchUserSchedules(userId);
      return schedules;
    } catch (e) {
      throw e;
    }
  }
);

/**
 * Persist changes to user data to the backend.
 */
export const updateStudentData = createAsyncThunk(
  'users/updateStudentData',
  async (user: StudentData) => {
    try {
      // TODO: Update user data in store
    } catch (e) {
      throw e;
    }
  }
);

export const removeSchedule = createAsyncThunk(
  'users/deleteSchedule',
  async ({ userId, scheduleId }: { userId: string, scheduleId: string }) => {
    try {
      await deleteSchedule(userId, scheduleId);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
);

export const loadRequirements = createAsyncThunk(
  'schedules/loadRequirements',
  async () => {
    // TODO: Globally load degree plan requirements for user
  }
);

export const importSchedule = createAsyncThunk(
  'schedules/importSchedule',
  async (scheduleJson: string) => {
    try {
      const schedule = JSON.parse(scheduleJson);
      // TODO: Validate schedule
      return schedule;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
);

export const exportSchedule = createAsyncThunk<
  string,
  string,
  {
    dispatch: AppDispatch,
    state: AppState,
  }
>(
  'schedules/exportSchedule',
  async (exportedId: string, { getState }) => {
    const schedule = getState().schedules.find(schedule => schedule.id === exportedId);
    if (!schedule) {
      throw new Error('Schedule with given ID does not exist in store.');
    }
    const scheduleJson = JSON.stringify(schedule);
    return scheduleJson;
  }
);
