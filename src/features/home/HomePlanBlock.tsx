import { makeStyles, Theme, createStyles, Button, Typography } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { createSamplePlan } from '../../app/data';
import SemesterBlock from '../planner/SemesterBlock';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
  },
  header: {},
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  block: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  semesterDisplay: {
    display: 'flex',
    marginTop: theme.spacing(2),
    flexWrap: 'wrap',
  },
  laterSemesterList: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  semesterItem: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

/**
 * A component that displays the currently active degree plan.
 */
export default function HomePlanBlock() {
  const classes = useStyles();

  const plan = createSamplePlan();

  const startSemester = 0;

  // TODO: Determine next semester using current semester
  const currentSemester = plan.semesters[startSemester];

  const firstBlock = {
    semesterCode: currentSemester.code,
    semesterTitle: currentSemester.title,
    courses: currentSemester.courses,
    onAddCourse: () => { },
    onShowSemesterInfo: () => { },
    onClearSemester: () => { },
    onRemoveSemester: () => { },
  };

  const laterSemesters = plan.semesters.slice(startSemester + 1, startSemester + 4)
    .map((semester) => {
      return (
        <div className={classes.semesterItem}>
          <SemesterBlock displayOnly
            semesterCode={semester.code}
            semesterTitle={semester.title}
            courses={semester.courses}
            onAddCourse={() => { }}
            onShowSemesterInfo={() => { }}
            onClearSemester={() => { }}
            onRemoveSemester={() => { }}
          />
        </div>
      );
    });

  return (
    <section className={classes.root}>
      <header className={classes.header}>
        <Typography variant="h5">Your current plan</Typography>
        <Button variant="contained" color="primary" component={Link} to="/plans/new">Open plan</Button>
      </header>
      <div className={classes.semesterDisplay}>
        <div className={classes.block}>
          <Typography variant="subtitle1">This semester</Typography>
          <div className={classes.semesterItem}>
            <SemesterBlock displayOnly {...firstBlock}></SemesterBlock>
          </div>
        </div>
        <div className={classes.block}>
          <Typography variant="subtitle1">What's next</Typography>
          <div className={classes.laterSemesterList}>
            {laterSemesters}
          </div>
        </div>
        {/* <div>
          <Button color="primary" component={Link} to="/plans/new">Start planning</Button>
        </div> */}
      </div>
    </section>
  );
}