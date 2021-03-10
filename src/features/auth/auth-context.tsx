import React from 'react';
import { useHistory } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Course, Grade } from '../../app/data';
import { YearClassification } from '../../app/student';

/**
 * A user for this app.
 */
export interface ServiceUser {
  /**
   * This user's globally unique primary identifier unrelated to any other
   * forms of identification.
   */
  id: string;

  /**
   * The user's preferred name. If the user has not set a preferred name yet (on
   * first-time set-up), and the user is authenticatd using a third-party
   * identity provider, this may be the user's full name.
   */
  name: string;

  /**
   * The user's email or null.
   *
   * If the user is signed in using a federated identify provider, this may be
   * null. If the user is not authenticated, this will be null.
   *
   * If the user has signed in with email and password, this will always be a
   * valid email.
   */
  email: string | null;

  /**
   * A profile image for the user.
   *
   * This may be null if the user has chosen not to upload a profile image or if
   * their federated identity provider does not have an image associated with
   * the user.
   */
  image: string | null;

  /**
   * Determines whether or not this user requires re-authentication to perform
   * a task.
   */
  requiresAuthentication: () => boolean;
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

const ANONYMOUS_USER = {
  id: 'guest',
  email: null,
  name: 'Student',
  image: null,
  requiresAuthentication(): boolean {
    return false;
  },
};

/**
 * A mapping of all users.
 */
export const users: { [key: string]: ServiceUser } = {
  anonymous: ANONYMOUS_USER,
  default: {
    id: 'default',
    email: null,
    name: 'Student',
    image: 'https://picsum.photos/256',
    // TODO: Probably rethink this approach
    requiresAuthentication(): boolean {
      return false;
    },
  }, // First (and only) signed in user
};

/**
 * Utility attributes and functions used to handle user auth state within an AuthContext.
 */
interface AuthContextState {
  /**
   * The current user. If no user is signed in, the user is anonymous.
   */
  user: ServiceUser;

  /**
   * Returns whether a user is currently signed in to the Service.
   */
  isSignedIn: boolean;

  /**
   * Forces a sign-in and redirects to the given link after success.
   *
   * @param redirect An in-app location to redirect to after sign-in
   */
  authWithRedirect: (redirect: string) => void;

  /**
   * Signs in using Google OAuth pop-up.
   */
  signInWithGoogle: () => void;

  /**
   * Signs in with email and password.
   */
  signInWithEmail: (email: string, password: string) => void;

  /**
   * Creates a new account with email and password.f
   */
  signUpWithEmail: (email: string, password: string) => void;

  /**
   * Switches the currently active account.
   */
  switchAccounts: (accountId: 'guest' | 'default') => void;

  /**
   * Signs out of the current user session if active.
   */
  signOut: () => Promise<void>;

  /**
   * Attempts sending a password reset link to the user with the given email.
   */
  resetPassword: (email: string) => void;
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
  const [user, setUser] = React.useState<ServiceUser>(users.anonymous);
  const [redirect, setRedirect] = React.useState('/app');
  const [shouldRedirect, setShouldRedirect] = React.useState(false);

  const history = useHistory();

  const updateUser = React.useCallback((firebaseUser: firebase.User | null) => {
    if (firebaseUser === null) {
      // User is signed out
      // TODO(auth): Determine if we want to remove user data from device on sign out
      setUser(ANONYMOUS_USER);
      return;
    }
    const { displayName, email, photoURL, uid } = firebaseUser;
    setUser({
      id: uid,
      name: displayName || 'Student',
      email: email,
      image: photoURL,
      requiresAuthentication(): boolean {
        // TODO: Determine based on last sign in time
        return false;
      },
    });
  }, []);

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      updateUser(user);
    });
  }, []);

  React.useEffect(() => {
    if (shouldRedirect) {
      if (redirect) {
        history.push(redirect);
        setShouldRedirect(false);
      } else {
        console.error('Redirect location is null');
      }
    }
  }, [shouldRedirect]);

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
  async function signOut() {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        const user = users.anonymous;
        setUser(user);
        setRedirect('/');
        setShouldRedirect(true);
        // TODO: Update localStorage
        console.log('Signed out user; switched to guest.');
      })
      .catch(() => {
        console.error('Could not sign out.');
      });
  }

  /**
   * Attempts resetting the password for the user with the given email.
   *
   * If an account with the given email does not exist, this is a no-op.
   *
   * @param email The user's email
   */
  const resetPassword = React.useCallback(async (email: string) => {
    // TODO: Probably create another function that uses the currently signed in user
    return firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        console.log('Password reset email sent.');
        setRedirect('/app');
      })
      .catch((error) => {
        console.error('Could not send password reset.', error);
        // TODO(auth): Handle error in UI
      });
  }, []);

  /**
   * Tries creating an account using the email and password provided.
   *
   * @param email The user's email
   * @param password The user's desired password
   */
  const signUpWithEmail = React.useCallback(async (email: string, password: string) => {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(({ /* credential, */ user }) => {
        updateUser(user);
        setRedirect('/app/onboarding');
        setShouldRedirect(true);
      })
      .catch((error) => {
        // Handle Errors here.
        const { code, message } = error;
        if (code == 'auth/weak-password') {
          console.warn('The password is too weak.');
        } else {
          console.log(message);
        }
        console.log(error);
      });
  }, []);

  /**
   * Authenticates using an email and password.
   *
   * @param email The user's email
   * @param password The user's password
   */
  const signInWithEmail = React.useCallback(async (email: string, password: string) => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(({ credential, user }) => {
        console.log('Credential', credential);
        console.log('User', user);
        if (user === null) {
          // Something really went wrong
          console.error("The signed-in user is null? That doesn't seem right.");
          return;
        }
        updateUser(user);
        setShouldRedirect(true);
      })
      .catch((error) => {
        console.error('Error when signing in', error);
        // TODO(auth): Handle error appropriately
      });
  }, []);

  const signInWithGoogle = React.useCallback(async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebase
      .auth()
      .signInWithPopup(provider)
      .then(({ credential, user }) => {
        console.log('Credential', credential);
        console.log('User', user);
        if (user === null) {
          // Something really went wrong
          console.error("The signed-in user is null? That doesn't seem right.");
          return;
        }
        updateUser(user);
        setShouldRedirect(true);
      })
      .catch((error) => {
        console.error('Error when signing in', error);
        // TODO(auth): Handle error appropriately
      });
  }, []);

  /**
   * Navigates to the AuthPage and forces a sign-in.
   *
   * @param redirect The link to navigate back after a successfull sign-in
   */
  const authWithRedirect = (redirect: string) => {
    history.push('/auth');
    setRedirect(redirect);
  };

  const isSignedIn = user.id !== 'anonymous';

  const authContextValue: AuthContextState = {
    user,
    isSignedIn,
    authWithRedirect,
    signUpWithEmail,
    switchAccounts,
    signInWithGoogle,
    signInWithEmail,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider, useAuthContext };
