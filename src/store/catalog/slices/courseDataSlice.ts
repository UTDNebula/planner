import { createSlice } from '@reduxjs/toolkit';
import { Course } from '../types';

const initialState: Course[] = [];

const courseDataSlice = createSlice({
  name: 'courses',
  initialState: initialState,
  reducers: {
    /**
     * 
     * @param state 
     * @param action 
     */
    addCourse(state, action) {

    },
    signOut(state, action) {

    },
  },
  extraReducers: (builder) => {
    // builder.addCase()
  },
});

export default courseDataSlice.reducer;
