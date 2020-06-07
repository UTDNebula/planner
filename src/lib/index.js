import { createStore, combineReducers } from 'redux';

import planner from '../planner/reducers';
import courses from '../courses/reducers';

const appState = combineReducers({
  planner,
  courses,
});

export const store = createStore(appState);
