import { combineReducers } from '@reduxjs/toolkit';

import creditsDataReducer from './creditsSlice';
import userDataReducer from './userDataSlice';

const rootReducer = combineReducers({
  userData: userDataReducer,
  creditsData: creditsDataReducer,
});

export default rootReducer;
