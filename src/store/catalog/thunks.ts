import { createAsyncThunk } from "@reduxjs/toolkit";

interface SearchCoursePayload {
  query: string;
}

export const searchCourse = createAsyncThunk(
  'catalog/loadCourse',
  async (payload: SearchCoursePayload) => {

  }
);
