import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SemesterCode } from '../common/data';

/**
 * Manage user credits
 */

/**
 * **A credit is considered transfer if its semester is undefined**
 */
export type Credit = {
  utdCourseCode: string;
  semester?: {
    year: number;
    semester: SemesterCode;
  };
};

/**
 * **A credit is a duplicate if**
 * - they are both transfer and count to the same UTD credit
 * - **OR**
 * - if they are both UTD credits and have the same semester
 */
const areEqual = (credit1: Credit, credit2: Credit) => {
  if (typeof credit1.semester !== typeof credit2.semester) {
    return false;
  }

  if (typeof credit1.semester === 'undefined' && typeof credit2.semester === 'undefined') {
    return credit1.utdCourseCode === credit2.utdCourseCode;
  }

  return (
    credit1.utdCourseCode === credit2.utdCourseCode &&
    credit1.semester.semester === credit2.semester.semester &&
    credit1.semester.year === credit2.semester.year
  );
};

type CreditsState = {
  credits: Credit[];
};

const initialState: CreditsState = {
  credits: [],
};

const creditsSlice = createSlice({
  name: 'credits',
  initialState,
  reducers: {
    addCredit: (state, { payload: newCredit }: PayloadAction<Credit>) => {
      // check if credits are duplicates
      if (state.credits.some((existingCredit) => areEqual(existingCredit, newCredit))) {
        return state;
      }

      return { ...state, credits: [...state.credits, newCredit] };
    },
    removeCredit: (state, { payload: creditToRemove }: PayloadAction<Credit>) => {
      return {
        ...state,
        credits: state.credits.filter((credit) => !areEqual(credit, creditToRemove)),
      };
    },
  },
});

export const { addCredit, removeCredit } = creditsSlice.actions;

export default creditsSlice.reducer;
