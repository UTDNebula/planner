import { createAsyncThunk } from '@reduxjs/toolkit';
import { Schedule } from '../user/types';
import { AppDispatch } from '..';
import { RootState } from '../reducers';
import { updateSchedule } from './slices/openScheduleSlice';
import { fetchSchedule } from '../../lib/api';

interface LoadScheduleParams {
  scheduleId: string;
}

/**
 * Retreive a schedule from the local storage.
 *
 * If the schedule cannot be found, then this attempts to fetch it from the
 * database. If it doesn't exist there, then an error is created.
 */
export const loadSchedule = createAsyncThunk<
  Schedule,
  LoadScheduleParams,
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>('users/loadSchedule', async (params: LoadScheduleParams, { dispatch, getState }) => {
  const schedules = getState().schedules.data;
  const { scheduleId } = params;
  try {
    const schedule = schedules[scheduleId];
    return schedule;
  } catch (e) {
    try {
      const schedule = await fetchSchedule(scheduleId);
    } catch (e) {
      throw e;
    }
    throw e;
  }
});
