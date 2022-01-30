import firebase from 'firebase';
import Head from 'next/head';
import React from 'react';
import { useDispatch } from 'react-redux';
import useUserPlanSheetTransition from '../../components/home/userPlanSheetTransition';
import UserWelcome from '../../components/home/UserWelcome';
import { useAuthContext } from '../../modules/auth/auth-context';
import { updateAllUserData, updateUser } from '../../modules/redux/userDataSlice';

/**
 * The home screen for the app.
 * If the user has a valid Firebase id, then the data will be loaded.
 */
export default function Home(): JSX.Element {
  const { sheetIsOpen, togglePlan } = useUserPlanSheetTransition();
  const { user } = useAuthContext();
  const [initiallySynced, setSync] = React.useState<boolean>(false);
  const firestore = firebase.firestore();
  const dispatch = useDispatch();
  dispatch(updateUser(user));
  console.log(user);

  if (user.id !== 'guest' && !initiallySynced) {
    console.log('uid');
    const userDoc = firestore
      .collection('users')
      .doc(user.id)
      .get()
      .then((userDoc) => {
        console.log('doc exists');
        if (userDoc) {
          const userData = userDoc.data();
          const userSlice = userData.userDataSlice;
          dispatch(updateAllUserData(userSlice));
        }
      })
      .catch((error) => {
        console.log('error: ', error);
      });
    setSync(true);
  }

  return (
    <div className="flex flex-col w-full h-full">
      <Head>
        <title>Nebula - Home</title>
      </Head>
      <UserWelcome />
    </div>
  );
}
