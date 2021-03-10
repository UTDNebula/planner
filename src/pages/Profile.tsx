import React from 'react';
import AppNavigation from '../components/common/AppNavigation';
import { useAuthContext } from '../features/auth/auth-context';
import { useUserProfileData } from '../features/profile/userProfileData';

/**
 * A page containing student attributes and other account settings.
 */
export default function ProfilePage(): JSX.Element {
  const { user } = useAuthContext();
  const { userInfo } = useUserProfileData(user.id);
  return (
    <div className="flex min-h-full">
      <AppNavigation />
      <main className="flex">
        <section className="p-4">
          <div className="text-headline5 font-bold">Your information</div>
          <div className="md:grid-col-3">
            <div>
              <div className="text-body1">Preferred Name</div>
              <div className="text-body2">{userInfo.preferredName}</div>
            </div>
          </div>
        </section>
        <section className="p-4">
          <div className="text-headline5 font-bold">Account management</div>
        </section>
      </main>
    </div>
  );
}
