import React from 'react';
import { useAuthContext } from '../../modules/auth/auth-context';

/**
 * A component that displays a greeting and the user's name.
 */
export default function UserWelcome(): JSX.Element {
  const { user } = useAuthContext();

  // const subtitle = fetchGreeting();

  return (
    <div className="my-2">
      <div className="text-headline3 font-bold">Welcome back, {user.name}.</div>
      <div className="text-headline5">Start planning your degree today!</div>
      <div className="text-subtitle1">Create a new plan or open an existing plan below</div>
    </div>
  );
}
