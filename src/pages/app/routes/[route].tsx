import firebase from 'firebase';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useAuthContext } from '../../../modules/auth/auth-context';
import { loadCredits } from '../../../modules/redux/creditsSlice';
import { RootState } from '../../../modules/redux/store';
import { loadUser } from '../../../modules/redux/userDataSlice';

// This page handles routing in the app
export default function Routing() {
  const router = useRouter();
  const { user } = useAuthContext();

  const dispatch = useDispatch();

  const [sync, setSync] = React.useState(false);
  const data = useSelector((state: RootState) => state.userData);

  // Runs whenever user is updated
  // TODO: Handle edge case if user signs into actual account after using guest account
  // i.e. find a way to smoothly save the data
  React.useEffect(() => {
    if (user) {
      console.info('User has changed.', user);
      // Sync Redux & Firebase
      dispatch(loadUser(user));
      // Handle credit syncing logic (REFACTOR THIS LATER)
      const firestore = firebase.firestore();
      firestore
        .collection('users')
        .doc(user.id)
        .get()
        .then((userDoc) => {
          if (userDoc.data() !== undefined) {
            // Return credits data
            const userData = userDoc.data();
            if (userData === undefined || userData.credits === undefined) {
              dispatch(loadCredits([]));
            } else {
              const creditsSlice = userData.credits;
              dispatch(loadCredits(creditsSlice));
            }
          }
        });

      setSync(true);
    }
  }, [user]);

  // TODO: Find a better way to know when dispatch(loadUser(user)) is done
  // Runs whenever Redux state is updated
  React.useEffect(() => {
    if (sync) {
      const { doneOnboarding } = data;
      // Send user to appropriate route
      if (doneOnboarding) {
        router.push('/app');
      } else {
        router.push('/app/onboarding');
      }
    }
  }, [data]);

  return <div></div>;
}
