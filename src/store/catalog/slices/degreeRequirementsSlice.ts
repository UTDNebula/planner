import { createSlice } from '@reduxjs/toolkit';

/**
 * TODO: Use caching system to prevent unnecessary reloads.
 */
const degreeRequirementsSlice = createSlice({
  name: 'user',
  initialState: {},
  reducers: {
    /**
     * Load the degree requirements for a particular degree plan.
     */
    loadRequirement(state, action) {},
  },
  extraReducers: {},
});

export default degreeRequirementsSlice.reducer;
