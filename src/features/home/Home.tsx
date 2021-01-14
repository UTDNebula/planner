import React from 'react';
import { AnimateSharedLayout, motion } from 'framer-motion';
import { NoticeBlock } from '../../components/home/announcements/NoticeBlock';
import UserWelcome from '../../components/home/UserWelcome';
import UserPlanSheet from '../../components/home/UserPlanSheet';
import useUserPlanSheetTransition from '../../components/home/userPlanSheetTransition';
import HomeUserInfo from '../../components/home/HomeUserInfo';

/**
 * The home screen for the app.
 */
export default function Home(): JSX.Element {
  const { sheetIsOpen, togglePlan } = useUserPlanSheetTransition();

  return (
    <AnimateSharedLayout>
      <main className="bg-gray-100 h-full">
        <div className="w-screen max-w-6xl mx-auto pt-16 p-4">
          <UserWelcome />
        </div>
        <section className="w-screen max-w-6xl mx-auto md:grid min-h-full lg:grid-cols-12 mb-8">
          <div className="lg:col-span-4 m-2 p-4 bg-yellow-200 rounded-md border-2 border-gray-300">
            <HomeUserInfo />
          </div>
          <div className="lg:col-span-8 m-2 p-4 bg-white rounded-md border-2 border-gray-300">
            <NoticeBlock />
          </div>
        </section>
        <motion.section
          layoutId="planSheet"
          className="mx-auto md:flex shadow-md rounded-lg"
          animate={
            sheetIsOpen
              ? {
                  y: 0,
                  width: '100vw',
                  height: '100%',
                }
              : {
                  y: 'auto',
                  width: '72rem',
                  height: 'auto',
                }
          }
          transition={{ duration: 0.33 }}
        >
          <UserPlanSheet isOpen={sheetIsOpen} onExpandClick={togglePlan} />
        </motion.section>
      </main>
    </AnimateSharedLayout>
  );
}
