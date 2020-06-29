import { createSlice } from '@reduxjs/toolkit';
import { PlannerAction } from '../types';

interface PlannerActionSliceState {
  /**
   * A list of the last taken actions.
   *
   * For most intents and purposes, the clipboard.
   */
  actions: PlannerAction[];
}

const initialState: PlannerActionSliceState = {
  actions: [],
};

const plannerActionSlice = createSlice({
  name: 'actions',
  initialState: initialState,
  reducers: {
    pushAction(state, action: { payload: PlannerAction }) {
      state.actions.push(action.payload);
    },
    popAction(state, action) {
      state.actions.pop();
    }
  }
});

export const {
  pushAction,
  popAction,
} = plannerActionSlice.actions;

export default plannerActionSlice.reducer;
