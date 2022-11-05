import { useRouter } from 'next/router';
import React from 'react';

import AuthCard from '../../components/auth/AuthCard';

/**
 * A page that presents a sign-in/sign-up box to the user.
 */
export default function AuthPage(): JSX.Element {
  const router = useRouter();
  const { task: state } = router.query;

  return (
    <>
      {/* <MarketingHeader /> */}
      <div className="relative flex flex-col items-center justify-center h-screen space-y-10 bg-gradient-to-r from-purple-500 to-blue-500">
        <section>
          <AuthCard authState={state as string} />
        </section>
      </div>
    </>
  );
}
