import { combineReducers } from '@reduxjs/toolkit';
import catalogDataReducer from '../features/planner/plannerDataSlice';
import userDataReducer from '../features/userData/userDataSlice';

const rootReducer = combineReducers({
  catalogData: catalogDataReducer,
  userData: userDataReducer,
});

export default rootReducer;
