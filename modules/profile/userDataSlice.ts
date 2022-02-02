import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import firebase from 'firebase';
import { ServiceUser, users, CourseAttempt, useAuthContext } from '../auth/auth-context';
import { StudentPlan, createSamplePlan } from '../common/data';

export interface PlannerDataState {
  user: ServiceUser;
  plans: {
    [key: string]: StudentPlan;
  };
  planIds: string[];
}

export interface CourseHistoryState {
  courses: CourseAttempt[];
}

export type AcademicDataState = PlannerDataState & CourseHistoryState;

export const samplePlan = createSamplePlan();

const initialState: AcademicDataState = {
  user: users.anonymous,
  plans: {
    [samplePlan.id]: samplePlan,
  },
  planIds: [samplePlan.id],
  courses: [],
};

const userDataSlice = createSlice({
  name: 'plannerData',
  initialState,
  //Any change made in the redux store will also be stored in the respective firebase firestore.
  reducers: {
    updateUser(state, action: PayloadAction<ServiceUser>) {
      //TODO: hydrate app with different values
      console.log('Seeting user');
      state.user = action.payload;
      return state;
    },
    updateCourseAudit(state, action: PayloadAction<CourseAttempt[]>) {
      const unique_id = state.user.id || 'guest';
      const resultingState = { ...state, courses: action.payload };
      const userDataSlice = { userDataSlice: resultingState };
      if (unique_id !== 'guest') {
        const firestore = firebase.firestore();
        firestore.collection('users').doc(unique_id).set(userDataSlice);
      }

      return resultingState;
    },
    updatePlan(state, action: PayloadAction<StudentPlan>) {
      const unique_id = state.user.id || 'guest';
      state.plans[action.payload.id] = action.payload;
      const userDataSlice = { userDataSlice: JSON.parse(JSON.stringify(state)) };
      if (unique_id !== 'guest') {
        const firestore = firebase.firestore();
        firestore.collection('users').doc(unique_id).set(userDataSlice);
      }

      return state;
    },
    updateAllUserData(state, action: PayloadAction<AcademicDataState>) {
      state = action.payload;
      return state;
    },
  },
});

export const { updateUser, updateCourseAudit, updatePlan, updateAllUserData } =
  userDataSlice.actions;

export default userDataSlice.reducer;
