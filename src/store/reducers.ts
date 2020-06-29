import { combineReducers } from '@reduxjs/toolkit';
import userDataReducer from './user/slices/userMetadataSlice';
import userSchedulesReducer from './user/slices/userSchedulesSlice';
import openScheduleReducer from './planner/slices/openScheduleSlice';
import courseDataReducer from './catalog/slices/courseDataSlice';
import degreeRequirementsReducer from './catalog/slices/degreeRequirementsSlice';

/**
 * The primary store reducer for Comet Planning.
 */
const rootReducer = combineReducers({
  user: userDataReducer,
  schedules: userSchedulesReducer,
  openSchedule: openScheduleReducer,
  courses: courseDataReducer,
  requirements: degreeRequirementsReducer,
});

export default rootReducer;
