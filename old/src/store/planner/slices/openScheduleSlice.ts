import { createSlice } from '@reduxjs/toolkit';
import { Schedule } from '../../user/types';

const initialState: Schedule = {
  id: 'test',
  name: '',
  owner: '',
  created: new Date().toISOString(),
  lastUpdated: new Date().toISOString(),
  semesters: [],
};

/**
 * A slice that acts as the currently open schedule saved in memory.
 *
 * Schedule planner state should primarily be located within specific
 * components.
 */
const openScheduleSlice = createSlice({
  name: 'currentSchedule',
  initialState: initialState,
  reducers: {
    /**
     * Update the currently active schedule
     */
    saveSchedule(state, action) {
      // TODO: Mark schedule as saved.
    },
    /**
     *
     */
    refreshSchedule(state, action) {},
    /**
     * Replace the currently active schedule in memory.
     */
    updateSchedule(state, action: { payload: Schedule }) {
      Object.assign(state, action.payload);
    },
  },
});

const { actions, reducer } = openScheduleSlice;

export const { saveSchedule, refreshSchedule, updateSchedule } = actions;

export default reducer;
