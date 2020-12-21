import { Box, colors, createStyles, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import { convertSemesterToData } from '../common/data-utils';
import AnnouncementsBlock from './AnnouncementsBlock';
import { Notice, StudentDetails } from './types';
import UserDetailsBlock from './UserDetailsBlock';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
    background: colors.grey[200],
    flexWrap: 'wrap',
    marginBottom: theme.spacing(2),
  },
  userDetails: {
    minWidth: 240,
  },
  announcements: {
    flex: 1,
    height: '100%',
  },
}));

export default function HomeUserAnnouncementsBlock() {
  const classes = useStyles();

  /**
   * 
   * Currently returns a list of sample notices.
   */
  function fetchNotices(): Notice[] {
    return [
      {
        title: 'You are about to become a junior by credit hours.',
        action: {
          text: 'Contact academic advisor',
          link: 'https://example.com',
        },
      },
      {
        title: 'It looks like this semester was a little rough. Maybe you should rethink your coursework.',
        action: {
          text: 'Review four year plan',
          link: 'https://example.com',
        },
      },
    ];
  }

  /**
   * Returns data for the currently signed in user
   */
  function getUserDetails(): StudentDetails {
    // TODO: Calculate based on active student data
    return {
      name: 'John Doe',
      planInfo: {
        type: 'BS',
        title: 'Computer Science',
      },
      honorsIndicators: [],
      enrolled: '2019f',
      estimatedGraduation: '2023s',
      coursesCompleted: 25,
      attemptedHours: 64,
      coursesRemaining: 32,
      gpa: 3.422,
    };
  }

  const studentDetails = getUserDetails();
  const notices = fetchNotices();

  const { type, title } = studentDetails.planInfo;
  const planTitle = `${type} in ${title}`; // TODO: Account for majors, minors  

  const {
    year: graduatingYear,
    semester: graduatingSemester,
  } = convertSemesterToData(studentDetails.estimatedGraduation);

  const classText = `Class of ${graduatingYear} ${graduatingSemester}`;
  const estimatedGraduation = classText;

  console.log(notices);

  return (
    <Box component="section" className={classes.root}>
      <div className={classes.userDetails}>
        {/* TODO: Probably just use a hook for this and fetch data directly in UserDetailsBlock */}
        <UserDetailsBlock
          name={studentDetails.name || 'Student'}
          planTitle={planTitle}
          honorsIndicators={[]}
          start={studentDetails.enrolled}
          classText={classText}
          estimatedGraduation={estimatedGraduation}
          coursesCompleted={studentDetails.coursesCompleted}
          attemptedHours={studentDetails.attemptedHours}
          coursesRemaining={studentDetails.coursesRemaining}
          gpa={studentDetails.gpa}
        />
      </div>
      <div className={classes.announcements}>
        <AnnouncementsBlock notices={notices} />
      </div>
    </Box>
  );
}
