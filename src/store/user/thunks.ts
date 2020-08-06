import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchStudentData, fetchUserSchedules, deleteSchedule } from '../../lib/api';
import { uploadSchedule } from '../../lib/api/schedules';
import { StudentData, Schedule } from './types';
import { addSchedule } from './slices/userSchedulesSlice';
import { updateUser } from './slices/userMetadataSlice';
import { AppDispatch, AppState } from '..';
import { loadAllSchedules } from '../../lib/storage';

interface UploadSchedulePayload {
  userId: string;
  schedule: Schedule;
}

/**
 * Add a schedule to the given user's list of schedules.
 */
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
  },
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
  },
);

/**
 * Load all the user's current schedules.
 *
 * Updates the current schedule state by synchronizing local schedules with
 * schedules from remote source.
 */
export const refreshSchedules = createAsyncThunk<
  void,
  string,
  {
    dispatch: AppDispatch;
    state: AppState;
  }
>('schedules/refreshSchedules', async (userId: string, { dispatch, getState }) => {
  try {
    const remoteSchedules = await fetchUserSchedules(userId);
    // TODO: Just skip remote fetch if timeout is met
    // TDOO: Turn O(n^2) to O(n)
    const schedules: Schedule[] = loadAllSchedules(userId); // Load from storage
    remoteSchedules.forEach((newSchedule) => {
      schedules.forEach((schedule) => {
        if (newSchedule.id !== schedule.id) {
          schedules.push(newSchedule);
        }
      });
    });
    schedules.forEach((schedule) => dispatch(addSchedule({ userId, schedule })));
  } catch (e) {
    console.error(e);
    throw e;
  }
});

/**
 * Persist changes to user data to the backend.
 */
export const updateStudentData = createAsyncThunk(
  'users/updateStudentData',
  async (user: StudentData, { dispatch }) => {
    try {
      // TODO: Update user data in store
      dispatch(updateUser({ user }));
    } catch (e) {
      throw e;
    }
  },
);

export const removeSchedule = createAsyncThunk(
  'users/deleteSchedule',
  async ({ userId, scheduleId }: { userId: string; scheduleId: string }) => {
    try {
      await deleteSchedule(userId, scheduleId);
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
);

export const loadRequirements = createAsyncThunk('schedules/loadRequirements', async () => {
  // TODO: Globally load degree plan requirements for user
});

export const importSchedule = createAsyncThunk<
  void,
  string,
  {
    dispatch: AppDispatch;
    state: AppState;
  }
>('schedules/importSchedule', async (scheduleJson: string, { dispatch, getState }) => {
  try {
    const schedule = JSON.parse(scheduleJson);
    // TODO: Validate schedule
    const userId = getState().user.data.id;
    dispatch(
      addSchedule({
        userId,
        schedule,
      }),
    );
    return schedule;
  } catch (e) {
    console.error(e);
    throw e;
  }
});

export const exportSchedule = createAsyncThunk<
  string,
  string,
  {
    dispatch: AppDispatch;
    state: AppState;
  }
>('schedules/exportSchedule', async (exportedId: string, { getState }) => {
  const schedule = getState().schedules.find((schedule) => schedule.id === exportedId);
  if (!schedule) {
    throw new Error('Schedule with given ID does not exist in store.');
  }
  const scheduleJson = JSON.stringify(schedule);
  return scheduleJson;
});
