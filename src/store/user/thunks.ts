import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchStudentData, fetchUserSchedules, deleteSchedule } from '../../lib/api';
import { uploadSchedule } from '../../lib/api/schedules';
import { StudentData, Schedule } from './types';
import { addSchedule, deleteAllSchedules } from './slices/userSchedulesSlice';
import { updateUser } from './slices/userMetadataSlice';
import { AppDispatch } from '..';
import { RootState } from '../reducers';
import { loadAllSchedules } from '../../lib/storage';
import { UserMetadataSliceState } from './slices/userMetadataSlice';

interface UploadSchedulePayload {
  schedule: Schedule;
}

/**
 * Add a schedule to the given user's list of schedules.
 */
export const addScheduleToUser = createAsyncThunk(
  'users/addScheduleToUser',
  async (payload: UploadSchedulePayload, { dispatch, getState }) => {
    // TODO: dispatch schedule add start
    const { user } = getState() as { user: UserMetadataSliceState };
    console.log('User');
    console.log(user);
    const userId = user.data.id;
    const { schedule } = payload;
    try {
      console.log('New schedule');
      console.log(schedule);
      await uploadSchedule(userId, schedule);
      dispatch(addSchedule({ userId, schedule }));
    } catch (e) {
      console.error(e);
      throw e;
    }
    return schedule;
  },
  // TODO: Dispatch schedule add end
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

const normalizeSchedules = (schedules: Schedule[]) =>
  Object.assign({}, ...schedules.map((schedule) => ({ [schedule.id]: schedule })));

/**
 * Load all the user's current schedules.
 *
 * Updates the current schedule state by synchronizing local schedules with
 * schedules from remote source.
 */
export const refreshSchedules = createAsyncThunk(
  'schedules/refreshSchedules',
  async (userId: string, { dispatch, rejectWithValue }) => {
    dispatch(deleteAllSchedules());
    try {
      const schedules: {
        [id: string]: Schedule;
      } = {};
      // TODO: Get state
      const localSchedules = loadAllSchedules(userId);
      for (const schedule of localSchedules) {
        schedules[schedule.id] = schedule;
      }
      const remoteSchedules = await fetchUserSchedules(userId);
      for (const schedule of remoteSchedules) {
        schedules[schedule.id] = schedule;
      }
      // TODO: Properly handle deleted schedules

      console.log('Refreshed schedules');
      console.log(schedules);
      for (const schedule of Object.values(schedules)) {
        dispatch(addSchedule({ userId, schedule }));
      }
      return schedules;
    } catch (e) {
      console.error(e);
      return rejectWithValue(e);
    }
  },
);

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
    state: RootState;
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
    state: RootState;
  }
>('schedules/exportSchedule', async (exportedId: string, { getState }) => {
  const schedule = getState().schedules.data[exportedId];
  if (!schedule) {
    throw new Error('Schedule with given ID does not exist in store.');
  }
  const scheduleJson = JSON.stringify(schedule);
  return scheduleJson;
});
