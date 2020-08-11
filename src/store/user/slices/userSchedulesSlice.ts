import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { Schedule } from '../types';
import { storeSchedule } from '../../../lib/storage';
import { addScheduleToUser } from '../thunks';

interface SchedulesState {
  data: {
    [key: string]: Schedule;
  };
  status: 'idle' | 'loading' | 'error';
  error: null | Error;
}

const initialState: SchedulesState = {
  data: {},
  status: 'idle',
  error: null,
};

const schedulesSlice = createSlice({
  name: 'schedules',
  initialState: initialState,
  reducers: {
    addSchedule(state, action: { payload: { userId: string; schedule: Schedule } }) {
      const { userId, schedule } = action.payload;
      storeSchedule(userId, schedule);
      state.data[schedule.id] = schedule;
    },
    updateSchedule(state, action: { payload: { id: string; schedule: Schedule } }) {
      const { id, schedule } = action.payload;
      state.data[id] = schedule;
    },
    deleteSchedule(state, action) {
      const scheduleId = action.payload;
      delete state.data[scheduleId];
    },
    deleteAllSchedules(state) {
      state.data = {};
    },
  },
  extraReducers: (builder) => {
    // builder.addCase(addScheduleToUser.fulfilled, (state, action) => {
    //   const schedule = action.payload as Schedule;
    //   state.data[schedule.id] = schedule;
    // });
    // builder.addCase(addScheduleToUser.rejected, (state, action) => {
    //   // state.error = action.error;
    //   // TODO: Mark error
    //   state.error = {
    //     name: 'AddScheduleError',
    //     message: 'Error when adding schedule to user',
    //   };
    // });
  },
});

export const {
  addSchedule,
  updateSchedule,
  deleteSchedule,
  deleteAllSchedules,
} = schedulesSlice.actions;

export default schedulesSlice.reducer;
