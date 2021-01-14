import React from 'react';
import { useAuthContext } from '../../features/auth/auth-context';

/**
 * Return a greeting based on the current user state.
 */
function fetchGreeting() {
  // TODO: Return a dynamic, witty message.
  return "It's been a while.";
}

/**
 * A component that displays a greeting and the user's name.
 */
export default function UserWelcome(): JSX.Element {
  const { user } = useAuthContext();

  const subtitle = fetchGreeting();

  return (
    <div className="my-2">
      <div className="text-headline4 font-bold">Welcome back, {user.name}.</div>
      <div className="text-headline6">{subtitle}</div>
    </div>
  );
}
