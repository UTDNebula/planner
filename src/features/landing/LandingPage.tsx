import React from 'react';
import { DragDropContext, SensorAPI } from 'react-beautiful-dnd';
import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import { createSamplePlan, StudentPlan } from '../../app/data';
import SemesterBlockList from '../planner/SemesterBlockList';
import LandingToolbar from './LandingToolbar';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
  },
  ctaButton: {
    marginTop: theme.spacing(4),
  },
}));

const SUBTEXT_VARIANTS = [
  'degree planning tool',
  'course planner'
];

/**
 * A hook for the drag-and-drop demo functionality.
 *
 * @see https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/sensors/sensor-api.md
 */
function useDemoSensor(plan: StudentPlan) {
  const semesters = plan.semesters;
  console.log(semesters);
  return (api: SensorAPI) => {
    // TODO: Make these hooks work
    // const start = React.useCallback(function start(event: MouseEvent) {
    //   // TODO: Swap out wih actual course card IDs
    //   const preDrag = api.tryGetLock('item-2');
    //   if (!preDrag) {
    //     return;
    //   }
    //   preDrag.snapLift();
    //   preDrag.moveDown();
    //   preDrag.drop();
    // }, []);

    // React.useEffect(() => {
    //   window.addEventListener('click', start);

    //   return () => {
    //     window.removeEventListener('click', start);
    //   };
    // }, []);
  };
}

/**
 * The primary landing page for the application.
 * 
 * This is mostly for marketing, but we also show some lightweight
 * interactive demos since why not.
 */
export default function LandingPage() {
  const contents = SUBTEXT_VARIANTS[0];

  const samplePlan = createSamplePlan(3);

  const demoSensor = useDemoSensor(samplePlan);

  const classes = useStyles();
  return (
    <div className="bg-gray-200 max-h-screen">
      <div className="md:h-screen lg:flex">
        <section className="md:h-full lg:flex-0 lg:left-thing bg-white">
          <div className="m-4 md:mt-64 lg:mx-32">
            <h1 className="text-headline2 font-bold">Comet Planning</h1>
            <div className="mt-8 text-headline4">
              <span className="block">
                A <span id="subheaderText">{contents}</span>
              </span>
            and so much more.
          </div>
            <Button
              className={classes.ctaButton}
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/app/plan/demo" >
              Try a demo
            </Button>
            <noscript>
              <div>
                The demo requires JavaScript. Please enable it to continue.
              </div>
            </noscript>
          </div>
        </section>
        <section className="h-full lg:flex-1">
          <LandingToolbar />
          <div className="overflow-x-hidden whitespace-nowrap">
            {/* TODO: Scripted drag and drop: https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/sensors/sensor-api.md */}
            <DragDropContext
              sensors={[demoSensor]}
              onDragEnd={() => { }}>
              <SemesterBlockList semesters={samplePlan.semesters} enabled={true} />
            </DragDropContext>
          </div>
        </section>
      </div>
    </div>
  );
}