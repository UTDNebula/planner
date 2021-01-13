import { combineReducers } from '@reduxjs/toolkit';
import plannerDataReducer from '../features/planner/plannerDataSlice';

const rootReducer = combineReducers({
  planData: plannerDataReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
