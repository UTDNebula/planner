import { makeStyles, Theme, createStyles, Button, Typography } from '@material-ui/core';
import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { Link } from 'react-router-dom';
import { createSamplePlan } from '../../app/data';
import SemesterBlock from '../planner/SemesterBlock';
import SemesterBlockList, { ScrollDirection } from '../planner/SemesterBlockList';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
      // paddingTop: theme.spacing(2),
      // marginRight: theme.spacing(2),
      // margin: theme.spacing(2),
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
  }),
);

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
  };

  const laterSemesters = plan.semesters.slice(startSemester + 1, startSemester + 4);

  return (
    <section className={classes.root}>
      <header className={classes.header}>
        <Typography variant="h5">Your current plan</Typography>
        <Button variant="contained" color="primary" component={Link} to="/app/plans/new">
          Open plan
        </Button>
      </header>
      <DragDropContext onDragEnd={() => console.log('Drag ended')}>
        <div className={classes.semesterDisplay}>
          <div className={classes.block}>
            <div className="px-4 text-headline6">This semester</div>
            <div className={classes.semesterItem}>
              <SemesterBlock enabled={false} {...firstBlock} />
            </div>
          </div>
          <div className={classes.block}>
            <div className="px-4 text-headline6">Upcoming semesters</div>
            {/* TODO: Remove need for DragDropContext */}
            <SemesterBlockList
              semesters={laterSemesters}
              enabled={false}
              direction={ScrollDirection.horizontally}
              focusedSemester={''}
            />
          </div>
          {/* <div>
          <Button color="primary" component={Link} to="/plans/new">Start planning</Button>
        </div> */}
        </div>
      </DragDropContext>
    </section>
  );
}
