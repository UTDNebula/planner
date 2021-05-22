import { combineReducers } from '@reduxjs/toolkit';
import catalogDataReducer from '../planner/plannerDataSlice';
import userDataReducer from '../profile/userDataSlice';

const rootReducer = combineReducers({
  catalogData: catalogDataReducer,
  userData: userDataReducer,
});

export default rootReducer;
