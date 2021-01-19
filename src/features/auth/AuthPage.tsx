import React from 'react';
import AuthCard from '../../components/auth/AuthCard';
import MarketingHeader from '../../components/common/MarketingHeader';
import { useAuthContext } from './auth-context';

/**
 * A page that presents a sign-in/sign-up box to the user.
 */
export default function AuthPage(): JSX.Element {
  // history.push('/app');
  // TODO: Like actually sign in

  const { resetPassword, signInWithGoogle } = useAuthContext();

  const handleForgetPassword = (email: string) => {
    resetPassword(email);
  };

  const handleSignUpWithGoogle = () => {
    signInWithGoogle();
  };

  return (
    <>
      <MarketingHeader />
      <div className="h-full w-full py-auto">
        <section className="max-w-xl mx-auto">
          <AuthCard
            onForgetPassword={handleForgetPassword}
            onGoogleSignIn={handleSignUpWithGoogle}
          />
        </section>
      </div>
    </>
  );
}
