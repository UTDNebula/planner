import React from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { NoticeBlock } from '../../components/home/announcements/NoticeBlock';
import UserWelcome from '../../components/home/UserWelcome';
import UserPlanSheet from '../../components/home/UserPlanSheet';
import useUserPlanSheetTransition from '../../components/home/userPlanSheetTransition';
import { updateUser, updateAllUserData } from '../../modules/profile/userDataSlice';
import { useAuthContext } from '../../modules/auth/auth-context';
import firebase from 'firebase';

const SHEET_START_ANIMATION = {
  y: 0,
  width: '100vw',
  height: '100%',
};

const SHEET_END_ANIMATION = {
  y: 'auto',
  width: '72rem',
  height: 'auto',
};

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
    <>
      <Head>
        <title>Nebula - Home</title>
      </Head>
      <div className="w-screen max-w-6xl mx-auto pt-16 p-4">
        <UserWelcome />
      </div>
      <section className="w-screen max-w-6xl mx-auto md:grid min-h-full lg:grid-cols-12 mb-8">
        <div className="lg:col-span-12 m-2 p-4 bg-white rounded-md border-2 border-gray-300">
          <NoticeBlock />
        </div>
      </section>
      <motion.section
        layoutId="planSheet"
        className="mx-auto md:flex shadow-md rounded-lg"
        animate={sheetIsOpen ? SHEET_START_ANIMATION : SHEET_END_ANIMATION}
        initial={{
          y: 'auto',
          width: '72rem',
          height: 'auto',
        }}
        transition={{ duration: 0.33 }}
      >
        <UserPlanSheet isOpen={sheetIsOpen} onExpandClick={togglePlan} />
      </motion.section>
    </>
  );
}
