import { useRouter } from 'next/router';
import React from 'react';
import AuthCard from '../../../components/auth/AuthCard';
import MarketingHeader from '../../../components/common/MarketingHeader';
import { useAuthContext } from '../../../modules/auth/auth-context';

/**
 * A page that presents a sign-in/sign-up box to the user.
 */
export default function AuthPage(): JSX.Element {
  // history.push('/app');
  // TODO: Like actually sign in

  const { resetPassword, signInWithGoogle, signOut } = useAuthContext();

  const router = useRouter();
  const { task } = router.query;

  React.useEffect(() => {
    const shouldSignOut = task === 'signOut';
    if (shouldSignOut) {
      signOut()
        .then(() => {
          console.debug('Succesfully signed out.');
        })
        .catch((error) => {
          console.error('Error signing out.', error);
        });
    }
  }, []);

  const handleForgetPassword = (email: string) => {
    resetPassword(email);
  };

  const handleSignUpWithGoogle = () => {
    signInWithGoogle();
  };

  return (
    <>
      {/* <MarketingHeader /> */}
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
