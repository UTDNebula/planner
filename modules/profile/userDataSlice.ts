import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ServiceUser, users } from '../auth/auth-context';
import { StudentPlan, createSamplePlan } from '../common/data';

export interface PlannerDataState {
  user: ServiceUser;
  plans: {
    [key: string]: StudentPlan;
  };
  planIds: string[];
}

// TODO: Load from local storage
const samplePlan = createSamplePlan();

const initialState: PlannerDataState = {
  user: users.guest,
  plans: {
    [samplePlan.id]: samplePlan,
  },
  planIds: [samplePlan.id],
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
  },
});

export const { updateUser } = userDataSlice.actions;

export default userDataSlice.reducer;
