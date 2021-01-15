import React from 'react';
import { Course, Grade } from '../../app/data';
import { YearClassification } from '../../app/student';

/**
 * A user for this app.
 */
export interface AuthUser {
  id: string;
  name: string;
  image: string | null;
}

export interface PlanData {
  id: string;
  title: string;
  type: 'major' | 'minor' | 'certificate' | 'honors';
}

export interface CourseAttempt {
  semester: string;
  grade: Grade;
  course: Course;
}

export interface StudentInfo {
  classification: YearClassification;
  /**
   * An ID corresponding to the user's primary major of study.
   */
  primaryMajor: string;
  /**
   * A list of IDs corresponding to all selected plans of study.
   */
  requiredPlans: PlanData[];

  joinDate: Date;

  attemptedCourses: CourseAttempt[];
}

/**
 * A mapping of all users.
 */
export const users: { [key: string]: AuthUser } = {
  guest: {
    id: 'guest',
    name: 'Guest Student',
    image: null,
  }, // No privileges
  default: {
    id: 'default',
    name: 'Student',
    image: 'https://picsum.photos/256',
  }, // First (and only) signed in user
};

interface AuthContextState {
  user: AuthUser;
  switchAccounts: (accountId: 'guest' | 'default') => void;
  signOut: () => void;
}

const AuthContext = React.createContext<AuthContextState | undefined>(undefined); // Find a better solution for this

/**
 * A React hook that exposes
 */
function useAuthContext(): AuthContextState {
  const context = React.useContext(AuthContext);
  if (context == null) {
    throw new Error('useAuthState must be used in an AuthContextProvider');
  }
  return context;
}

function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [user, setUser] = React.useState<AuthUser>(users.guest);

  /**
   * Switches the currently active user session.
   *
   * @param accountId The UID of the account to switch to
   */
  function switchAccounts(accountId: 'guest' | 'default') {
    const user = users[accountId];
    setUser(user);
    // TODO: Update localStorage
    console.log('Switched active account to ' + accountId);
  }

  /**
   * Signs out the currently signed-in user.
   *
   * This switches to the guest user.
   */
  function signOut() {
    const user = users.guest;
    setUser(user);
    // TODO: Update localStorage
    console.log('Signed out user; switched to guest.');
  }

  const authContextValue = {
    user,
    switchAccounts,
    signOut,
  };

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider, useAuthContext };
