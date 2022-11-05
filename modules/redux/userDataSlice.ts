import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import firebase from 'firebase';

import { OnboardingFormData } from '../../pages/app/onboarding';
import { CourseAttempt, ServiceUser, users } from '../auth/auth-context';
import { createSampleOnboarding, StudentPlan } from '../common/data';

/**
 * Manages user plans
 */
export interface PlannerDataState {
  user: ServiceUser;
  plans: {
    [key: string]: StudentPlan;
  };
}

/**
 * Manages user course history
 */
export interface CourseHistoryState {
  courses: CourseAttempt[];
}

export interface UserState {
  doneOnboarding: boolean;
  onboarding: OnboardingFormData;
}

/**
 * User data type that contains all
 * academic data.
 *
 * This is the data type that's being
 * stored in Redux and Firebase.
 *
 */
export type AcademicDataState = PlannerDataState & CourseHistoryState & UserState;

const sampleOnboarding = createSampleOnboarding();

// Default data for application & guest users
const initialState: AcademicDataState = {
  onboarding: sampleOnboarding,
  doneOnboarding: false,
  user: users.unauthenticated,
  plans: {},
  courses: [],
};

// TODO: Separate into multiple data slices
// for better separation of concerns

/**
 * This middleware function runs every time a
 * new user is signed in (not including guests).
 *
 * The function gets user data from the database
 * if it exists, then updates the Redux store
 * with the user data.
 *
 * If no data is found, then the user info along
 * with the default data is loaded into Redux.
 *
 * TODO: Figure out elegant way to handle guest
 * user logging into an already made account.
 *
 */
export const loadUser = createAsyncThunk<
  AcademicDataState,
  ServiceUser,
  { state: { userData: AcademicDataState } }
>('userData/loadUser', async (user: ServiceUser, { getState }) => {
  const firestore = firebase.firestore();
  let userSlice: AcademicDataState = JSON.parse(JSON.stringify(getState().userData));
  if (user.id !== 'guest') {
    const slice = await firestore
      .collection('users')
      .doc(user.id)
      .get()
      .then((userDoc) => {
        if (userDoc.data() !== undefined) {
          // Return user data
          const userData = userDoc.data();
          userSlice = userData.userDataSlice;
        } else {
          // Create new user data
          // If the user was previously a guest, load all
          // guest created plans to new data
          userSlice.user = JSON.parse(JSON.stringify(user));
          // userSlice.plans = plans;

          // Remove unncessary (and error-causing) field
          delete userSlice.user.requiresAuthentication;
          saveToFirebase(user.id, { userDataSlice: userSlice });
        }

        return userSlice;
      })
      .catch((error) => {
        console.log('error: ', error);
      });
    return slice as AcademicDataState;
  } else {
    // Update authentication state for guest user
    userSlice.user = user;
    delete userSlice.user.requiresAuthentication;
    return userSlice;
  }
});

/**
 * Stores user data to firebase
 * TODO: Have saveToFirebase automatically run each time a reducer is called
 * @param id user ID
 * @param data user's academic data
 */
function saveToFirebase(id: string, data: { userDataSlice: AcademicDataState }) {
  if (id !== 'guest') {
    const firestore = firebase.firestore();
    firestore.collection('users').doc(id).set(data, { merge: true });
  }
}
const userDataSlice = createSlice({
  name: 'user',
  initialState,
  //Any change made in the redux store will also be stored in the respective firebase firestore.
  reducers: {
    updateUser(state, action: PayloadAction<ServiceUser>) {
      //TODO: hydrate app with different values
      console.log('Seeting user');
      state.user = action.payload;
      return state;
    },
    updateCourseAudit(state, action: PayloadAction<CourseAttempt[]>) {
      const unique_id = state.user.id || 'guest';
      const resultingState = { ...state, courses: action.payload };
      const userDataSlice = { userDataSlice: resultingState };
      saveToFirebase(unique_id, userDataSlice);
      return resultingState;
    },
    updatePlan(state, action: PayloadAction<StudentPlan>) {
      const unique_id = state.user.id || 'guest';
      state.plans[action.payload.id] = action.payload;
      const userDataSlice = { userDataSlice: JSON.parse(JSON.stringify(state)) };
      saveToFirebase(unique_id, userDataSlice);
      return state;
    },
    deletePlan(state, action: PayloadAction<string>) {
      delete state.plans[action.payload];
      const userDataSlice = { userDataSlice: JSON.parse(JSON.stringify(state)) };
      saveToFirebase(state.user.id, userDataSlice);
      return state;
    },
    updateAllUserData(state, action: PayloadAction<AcademicDataState>) {
      state = action.payload;
      return state;
    },
    resetStore(state) {
      // Runs whenever user signs out
      console.log('Running signout code');
      state = { ...initialState };
      return state;
    },
    updateOnboarding(state, action: PayloadAction<OnboardingFormData>) {
      state.doneOnboarding = true;
      state.onboarding = action.payload;
      const userDataSlice = { userDataSlice: JSON.parse(JSON.stringify(state)) };
      saveToFirebase(state.user.id, userDataSlice);
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.fulfilled, (state, action: PayloadAction<AcademicDataState>) => {
        // Runs if loadUser(userId) is successful
        return action.payload;
      })
      .addCase(loadUser.rejected, (state, action) => {
        // Runs if loadUser(userId) fails
        // TODO: Figure out more robust error handling
        // Load initial state if error occurs
        return initialState;
      });
  },
});

export const {
  updateUser,
  updateCourseAudit,
  updatePlan,
  deletePlan,
  updateAllUserData,
  resetStore,
  updateOnboarding,
} = userDataSlice.actions;

export default userDataSlice.reducer;
