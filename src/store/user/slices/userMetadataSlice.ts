import { createSlice } from '@reduxjs/toolkit';
import { fetchUserById } from '../thunks';
import { StudentData } from '../types';

export interface UserMetadataSliceState {
  data: StudentData;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: { e: Error } | null;
}

const initialState: UserMetadataSliceState = {
  data: {
    id: 'test',
    name: '',
    email: '',
    picture: '',
    startTerm: '2020f',
    endTerm: '2024f', // TODO: get generator function
    classification: 'fr',
    attemptedCreditHours: 0,
    gpa: 0,
    attemptedCourses: [],

    // /**
    //  * A list of all required courses this student must take to graduate.
    //  */
    requirements: [],

    // /**
    //  * The IDs of the CoursePlans being attempted.
    //  */
    // plans: Array<string>;
  },
  loading: 'idle',
  error: null,
};

const userMetadataSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    /**
     * Should be called on sign-in.
     */
    updateUser(state, action: { payload: { user: StudentData } }) {
      const updatedUser = action.payload.user;
      state.data = updatedUser;
    },
    signOut(state, action) {
      state.data = initialState.data;
    },
  },
  extraReducers: (builder) => {
    // builder.addCase(fetchUserById.fulfilled, (state, { payload }) => {
    //   state.data = payload;
    //   // TODO: Account for extra properties
    // });
    // builder.addCase(fetchUserById.rejected, (state, { payload }) => {});
  },
});

const { actions, reducer } = userMetadataSlice;

export const { updateUser, signOut } = actions;

export default reducer;
