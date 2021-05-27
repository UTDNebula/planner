import { createSlice } from '@reduxjs/toolkit';
import { CoursePlan } from '../common/api/plans';
import { Course } from '../common/data';

interface CourseData {
  courseIds: string[];
  courses: {
    [key: string]: Course;
  };
}

interface CatalogData {
  degreeIds: string[];
  degrees: {
    [key: string]: CoursePlan;
  };
}

export interface PlannerDataState extends CourseData, CatalogData {}

const initialState: PlannerDataState = {
  courseIds: [],
  courses: {},
  degreeIds: [],
  degrees: {},
};

const plannerDataSlice = createSlice({
  name: 'plannerData',
  initialState,
  reducers: {
    addCourse() {
      console.log('Adding course');
    },
    removeCourse() {
      console.log('Removing course');
    },
    addDegree() {
      console.log('Adding degree');
    },
    removeDegree() {
      console.log('Adding degree');
    },
  },
});

export const {} = plannerDataSlice.actions;

export default plannerDataSlice.reducer;
