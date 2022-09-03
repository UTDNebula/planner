import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { useAuthContext } from '../../../modules/auth/auth-context';
import { RootState } from '../../../modules/redux/store';
import { AcademicDataState, loadUser } from '../../../modules/redux/userDataSlice';

// This page handles routing in the app
export default function Routing() {
  const router = useRouter();
  const { user } = useAuthContext();

  const dispatch = useDispatch();

  const [sync, setSync] = React.useState(false);
  const data = useSelector((state: RootState) => state.userData);

  // Runs whenever user is updated
  React.useEffect(() => {
    if (user) {
      console.info('User has changed.', user);

      // Sync Redux & Firebase
      dispatch(loadUser(user));
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
