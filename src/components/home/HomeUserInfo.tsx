import React from 'react';
import { useAuthContext } from '../auth/auth-context';

/**
 * A block of user information.
 *
 * User data is fetched from the AuthContext.
 */
export default function HomeUserInfo(): JSX.Element {
  const { user } = useAuthContext();

  const subtitleText = 'Junior studying Computer Science';
  const distinguishmentText = 'A Computer Science Scholar';

  return (
    <>
      <h1 className="text-headline5">{user.name}</h1>
      <div className="text-subtitle1">{subtitleText}</div>
      <div className="text-caption">{distinguishmentText}</div>
    </>
  );
}
