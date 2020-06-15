import { createStore, combineReducers } from 'redux';

import planner from '../planner/reducers';
import courses from '../courses/reducers';
import { Course } from './types';
import { LOAD_USER_DATA } from '../schedules/actions';
import { LOAD_COURSES, LOAD_CATALOGS } from '../courses/actions';
import { ConnectedProps, connect } from 'react-redux';

const appState = combineReducers({
  planner,
  courses,
});

interface RootReducer {
  planner: object;
  courses: Array<Course>;
  user: object;
}

const mapState = (state: RootReducer) => ({
  planner: state.planner,
  courses: state.courses,
  user: state.user,
});

const mapDispatch = {
  loadUser: (id: string) => ({
    type: LOAD_USER_DATA,
  }),
  loadCourses: () => ({
    type: LOAD_COURSES,
  }),
  loadCatalogs: () => ({
    type: LOAD_CATALOGS,
  }),
};

export const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  
}

export const store = createStore(appState);
