import { useRouter } from 'next/router';
import { useAuthContext } from '../../../modules/auth/auth-context';

/**
 * A page that handles authentication, including sign in and sign out.
 */
export default function AuthPage() {
  const router = useRouter();
  const { signOut, isSignedIn } = useAuthContext();
  const shouldSignOut = router.route === '/app/auth/signOut';
  if (shouldSignOut) {
    signOut()
      .then(() => {
        console.debug('Succesfully signed out.');
      })
      .catch((error) => {
        console.error('Error signing out.', error);
      });
  }
  return <div>Is signed in: {isSignedIn}</div>;
}
