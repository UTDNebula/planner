import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import firebase from 'firebase';

import { SemesterCode } from '../common/data';

/**
 * Manage user credits
 */

/**
 * **A credit is considered transfer if its semester is null** \
 * **Firebase does not support 'undefined'
 */
export type Credit = {
  utdCourseCode: string;
  semester: {
    year: number;
    semester: SemesterCode;
  } | null;
};

/**
 * **A credit is a duplicate if**
 * - they are both transfer and count to the same UTD credit
 * - **OR**
 * - if they are both UTD credits and have the same semester
 */
const areEqual = (credit1: Credit, credit2: Credit) => {
  if ((!credit1.semester && credit2.semester) || (credit1.semester && !credit2.semester)) {
    return false;
  }

  if (!credit1.semester && !credit2.semester) {
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

const saveToFirebase = (newState: CreditsState) => {
  const firestore = firebase.firestore();
  const user = firebase.auth().currentUser;
  firestore.collection('users').doc(user.uid).set(newState, { merge: true });
};

const creditsSlice = createSlice({
  name: 'credits',
  initialState,
  reducers: {
    loadCredits: (state, { payload: loadCredits }: PayloadAction<Credit[]>) => {
      const newCreditState = { ...state, credits: [...loadCredits] };
      return newCreditState;
    },
    addCredit: (state, { payload: newCredit }: PayloadAction<Credit>) => {
      // check if credits are duplicates
      if (state.credits.some((existingCredit) => areEqual(existingCredit, newCredit))) {
        return state;
      }

      const newCreditState = { ...state, credits: [...state.credits, newCredit] };
      saveToFirebase(newCreditState);

      return newCreditState;
    },
    removeCredit: (state, { payload: creditToRemove }: PayloadAction<Credit>) => {
      const newCreditState = {
        ...state,
        credits: state.credits.filter((credit) => !areEqual(credit, creditToRemove)),
      };

      saveToFirebase(newCreditState);
      return newCreditState;
    },
    resetCredits: () => ({ ...initialState }),
  },
});

export const { loadCredits, addCredit, removeCredit, resetCredits } = creditsSlice.actions;

export default creditsSlice.reducer;
