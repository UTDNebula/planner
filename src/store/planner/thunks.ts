import { createAsyncThunk } from "@reduxjs/toolkit";
import { Schedule } from "../user/types";
import { AppDispatch, AppState } from '..';
import { updateSchedule } from "./slices/openScheduleSlice";
import { fetchSchedule } from "../../lib/api";

interface LoadScheduleParams {
  scheduleId: string;
}

export const loadSchedule = createAsyncThunk<
  Schedule,
  LoadScheduleParams,
  {
    dispatch: AppDispatch,
    state: AppState,
  }
>(
  'users/loadSchedule',
  async (params: LoadScheduleParams, { dispatch, getState }) => {
    const schedules = getState().schedules;
    const scheduleIndex = schedules.findIndex(schedule => (
      schedule.id === params.scheduleId));
    if (scheduleIndex !== -1) { // Schedule already in schedules
      dispatch(updateSchedule(schedules[scheduleIndex]));
      return schedules[scheduleIndex];
    }
    try {
      const schedule = await fetchSchedule(params.scheduleId);
      // TODO: Dispatch adding schedule to current schedules
      return schedule;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
);
