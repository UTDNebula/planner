import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ServiceUser, users, CourseAttempt } from '../auth/auth-context';
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

// TODO: Load from local storage
const samplePlan = createSamplePlan();

const initialState: AcademicDataState = {
  user: users.guest,
  plans: {
    [samplePlan.id]: samplePlan,
  },
  planIds: [samplePlan.id],
  courses: [],
};

const userDataSlice = createSlice({
  name: 'plannerData',
  initialState,
  reducers: {
    updateUser(state, action: PayloadAction<ServiceUser>) {
      console.log('Seeting user');
      state.user = action.payload;
      return state;
    },
    updateCourseAudit(state, action: CourseAttempt[]) {
      //console.log(action);
      return {
        ...state,
        courses: action.payload,
      };
    },
  },
});

export const { updateUser, updateCourseAudit } = userDataSlice.actions;

export default userDataSlice.reducer;
