import { useRouter } from 'next/router';
import React from 'react';
import { useAuthContext } from '../../modules/auth/auth-context';
import Login from './Login';
import Signup from './Signup';

/**
 * Props for AuthCard
 */
type AuthCardProps = {
  /**
   * Specifies what components to render and/or
   * side effects to run based on the route passed
   * into pages/auth/[task.tsx]
   */
  authState: string;
};

/**
 * A dialog that exposes different sign-in/sign-up methods.
 * TODO: Add ability to reset passwords (do once Nebula Profile comes out)
 */
export default function AuthCard({ authState }: AuthCardProps): JSX.Element {
  const router = useRouter();

  const { signOut } = useAuthContext();

  /**
   * Sign the user out of Planner
   */
  const handleSignOut = () => {
    signOut()
      .then(() => {
        console.debug('Succesfully signed out.');
      })
      .catch((error) => {
        console.error('Error signing out.', error);
      });
  };

  /**
   * List of possible side effects
   * to run based on auth state
   */
  const actionManager = {
    login: emptyAction,
    signup: emptyAction,
    reset: emptyAction,
    signOut: handleSignOut,
  };

  function emptyAction() {
    console.log('No side effect run');
  }

  /**
   * Runs whenever an invalid route is passed
   * into /app/auth
   */
  function invalidAction() {
    console.error('Invalid route, returning to login screen.');
    router.push('/app/auth/login');
  }

  /**
   * List of possible components
   * to render based on auth state
   */
  const contentManager = {
    login: <Login />,
    signup: <Signup />,
    reset: <div>Build reset password page</div>,
    signOut: <div>Build sign out page</div>,
  };

  // Displays page content based on auth state
  const content: JSX.Element = contentManager[authState];

  // Runs side effects based on auth state
  React.useEffect(() => {
    if (authState !== undefined) {
      const authAction = actionManager[authState] ?? invalidAction;
      authAction();
    }
  }, [authState]);

  return <div className="m-2 bg-white md:rounded-md md:shadow-md">{content}</div>;
}
