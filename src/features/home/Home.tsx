import React from 'react';
import { Button, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { AccountBox } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { AnimateSharedLayout, motion } from 'framer-motion';
import { NoticeBlock } from '../../components/home/announcements/NoticeBlock';
import UserWelcome from '../../components/home/UserWelcome';
import UserPlanSheet from '../../components/home/UserPlanSheet';
import useUserPlanSheetTransition from '../../components/home/userPlanSheetTransition';
import HomeUserInfo from '../../components/home/HomeUserInfo';
import { useAppLocation } from '../common/appLocation';

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
  const { updateTitle } = useAppLocation();
  React.useEffect(() => {
    updateTitle('Home');
  }, []);

  return (
    <AnimateSharedLayout>
      <div className="flex w-full h-full">
        <nav className="flex-0">
          <div className="p-8">
            <HomeUserInfo />
            <div className="my-2">
              <Button component={Link} to="/auth/signOut">
                Sign out
              </Button>
            </div>
          </div>
          <List>
            <ListItem button component={Link} to="/app/profile">
              <ListItemIcon>
                <AccountBox />
              </ListItemIcon>
              <ListItemText primary="Manage profile" />
            </ListItem>
          </List>
        </nav>
        <main className="h-full flex-1 bg-gray-100">
          <div className="w-screen max-w-6xl mx-auto pt-16 p-4">
            <UserWelcome />
          </div>
          <section className="w-screen max-w-6xl mx-auto md:grid min-h-full lg:grid-cols-12 mb-8">
            <div className="lg:col-span-4 m-2 p-4 bg-yellow-200 rounded-md border-2 border-gray-300">
              <HomeUserInfo />
            </div>
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
