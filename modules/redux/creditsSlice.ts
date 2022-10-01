import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Manage user credits
 * Properties of credits
 * - there cannot be duplicate credits
 * - each uniquely identified by utdCourseCode
 * */
export type Credit = {
  utdCourseCode: string;
  isTransfer: boolean;
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
      // // check for duplicates (see top comment)
      if (
        state.credits.some(
          (existingCredit) =>
            existingCredit.utdCourseCode === newCredit.utdCourseCode &&
            existingCredit.isTransfer === newCredit.isTransfer,
        )
      ) {
        return state;
      }
      return { ...state, credits: [...state.credits, newCredit] };
    },
    removeCredit: (state, { payload: creditToRemove }: PayloadAction<Credit>) => {
      return {
        ...state,
        credits: state.credits.filter(
          (credit) => credit.utdCourseCode !== creditToRemove.utdCourseCode,
        ),
      };
    },
    flagAsTransfer: (state, { payload: creditToFlag }: PayloadAction<Credit>) => {
      return {
        ...state,
        credits: state.credits.map(
          (credit) =>
            credit.utdCourseCode === creditToFlag.utdCourseCode && { isTransfer: true, ...credit },
        ),
      };
    },
  },
});

export const { addCredit, flagAsTransfer, removeCredit } = creditsSlice.actions;

export default creditsSlice.reducer;
