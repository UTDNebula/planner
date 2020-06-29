import { createSlice } from '@reduxjs/toolkit';
import { Schedule } from '../types';

const initialState: Schedule[] = [];

const schedulesSlice = createSlice({
  name: 'schedules',
  initialState: initialState,
  reducers: {
    addSchedule(state, action: { payload: { userId: string, schedule: Schedule } }) {
      const schedule = action.payload.schedule;
      console.log('New schedule added to store');
      console.log(schedule);
      state.push(schedule);
    },
    updateSchedule(state, action: { payload: { id: string, schedule: Schedule } }) {
      const schedule = action.payload.schedule;
      console.log('Schedule updated in store');
      console.log(schedule);
      const index = state.findIndex(oldSchedule => oldSchedule.id === action.payload.id);
      state[index] = action.payload.schedule;
    },
    deleteSchedule(state, action) {
      const scheduleId = action.payload;
      Object.assign(state, state.filter(schedule => schedule.id !== scheduleId));
    },
  },
});

export const {
  addSchedule,
  updateSchedule,
  deleteSchedule
} = schedulesSlice.actions;

export default schedulesSlice.reducer;
