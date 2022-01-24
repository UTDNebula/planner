import React from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { NoticeBlock } from '../../components/home/announcements/NoticeBlock';
import UserWelcome from '../../components/home/UserWelcome';
import UserPlanSheet from '../../components/home/UserPlanSheet';
import useUserPlanSheetTransition from '../../components/home/userPlanSheetTransition';
import { useSelector } from 'react-redux';
import { RootState } from '../../modules/common/store';
import NavigationBar from '../../components/home/NavigationBar';
import PlanCard from './PlanCard';
import { v4 as uuid } from 'uuid';
import { useRouter } from 'next/router';
import AddIcon from '@material-ui/icons/Add';
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

  const router = useRouter();

  // TODO: Write function to get user plans
  const { plans: userPlans } = useSelector((state: RootState) => state.userData);
  const plans = Object.values(userPlans);

  const handleCreatePlan = async () => {
    // Generate route id
    const routeID = uuid();
    router.push(`/app/plans/${routeID}`);
  };

  return (
    <div className="flex flex-col w-screen h-full">
      <Head>
        <title>Nebula - Home</title>
      </Head>
      <NavigationBar />
      <div className="w-screen max-w-6xl mx-auto pt-16 p-4">
        <UserWelcome />
      </div>
      <div className="flex flex-1 justify-center items-center bg-white">
        <section className="grid grid-cols-3 mx-40 my-20">
          <button
            onClick={handleCreatePlan}
            className="w-60 h-40 m-10 flex p-4 border justify-center items-center hover:bg-gray-100 border-gray-400 rounded-md shadow-xl"
          >
            <div className="flex flex-col justify-center items-center">
              <div className="text-3xl">
                <AddIcon fontSize="inherit" />
              </div>
              <div className="text-lg">Create Plan</div>
            </div>
          </button>
          {plans.map((plan) => (
            <PlanCard key={plan.id} id={plan.id} plan={plan} />
          ))}
        </section>
      </div>
      {/* <section className="w-screen flex justify-center items-center ">
        <div className="flex flex-col p-10 m-10 w-3/4 bg-gray-400 h-80">
          <div>Your Plans</div>
          <div className="flex flex-row flex-wrap">
            {plans.map((plan) => (
              <div className="m-4 ">{plan.title}</div>
            ))}
          </div>
        </div>
      </section> */}
      {/* <section className="w-screen max-w-6xl mx-auto md:grid min-h-full lg:grid-cols-12 mb-8">
        <div className="lg:col-span-12 m-2 p-4 bg-white rounded-md border-2 border-gray-300">
          <NoticeBlock />
        </div>
      </section> */}
      {/* <motion.section
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
      </motion.section> */}
    </div>
  );
}
