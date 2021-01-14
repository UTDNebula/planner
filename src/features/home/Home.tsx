import React from 'react';
import styles from './Home.module.css';
import { NoticeBlock } from '../../components/home/announcements/NoticeBlock';
import UserWelcome from '../../components/home/UserWelcome';

/**
 * The home screen for the app.
 */
export default function Home(): JSX.Element {
  return (
    <>
      <div className="container mx-auto mt-16 p-4">
        <UserWelcome />
      </div>
      <section className="container mx-auto md:grid min-h-full lg:grid-cols-12">
        <div className="lg:col-span-4 bg-blue-200 rounded-md m-2 p-4">
          <h1 className="text-headline5">Student Name</h1>
          <div className="text-subtitle1">Junior studying Computer Science</div>
          <div className="text-caption">A Computer Science Scholar</div>
        </div>
        <div className="lg:col-span-8 bg-gray-200 rounded-md m-2 p-4 border-2 border-gray-300">
          <NoticeBlock />
        </div>
      </section>
      <section className="container mx-auto md:flex m-4 border-gray-400 shadow-md">
        <div className={styles.blockCardVariant}>
          <div className="text-headline5">This semester</div>
          {/* Courses */}
        </div>
        <div className={styles.blockCard}>
          <div className="text-headline5">What&apos;s next</div>
        </div>
      </section>
    </>
    // <Container className={classes.root}>
    //   <HomeUserAnnouncementsBlock />
    //   <HomePlanBlock />
    // </Container>
  );
}
