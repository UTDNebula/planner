import React from 'react';
import { AnimateSharedLayout, motion } from 'framer-motion';
import Head from 'next/head';
import { NoticeBlock } from '../../components/home/announcements/NoticeBlock';
import UserWelcome from '../../components/home/UserWelcome';
import UserPlanSheet from '../../components/home/UserPlanSheet';
import useUserPlanSheetTransition from '../../components/home/userPlanSheetTransition';
import AppNavigation from '../../components/common/AppNavigation';

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
 */
export default function Home(): JSX.Element {
  const { sheetIsOpen, togglePlan } = useUserPlanSheetTransition();

  return (
    <AnimateSharedLayout>
      <Head>
        <title>Nebula - Home</title>
        <meta name="description" content="Overview of your plan and important notices." />
      </Head>
      <div className="flex w-full h-full">
        <AppNavigation />
        <main className="h-full flex-auto bg-gray-100">
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
        </main>
      </div>
    </AnimateSharedLayout>
  );
}
