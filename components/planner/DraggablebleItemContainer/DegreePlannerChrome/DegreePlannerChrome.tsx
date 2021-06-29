import React from 'react';
import {
  makeStyles,
  Theme,
  createStyles,
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { DragDropContext } from 'react-beautiful-dnd';
import AddSemesterTrigger from '../../AddSemesterTrigger/AddSemesterTrigger';
import SemesterBlockList, { ScrollDirection } from '../../../common/SemesterBlockList';
import AddCourseDialog from '../../AddCourseDialog/AddCourseDialog';
import useUserPlanData from '../../../common/userPlanData';
import { useAuthContext } from '../../../../modules/auth/auth-context';
import { loadCourses } from '../../../../modules/common/api/courses';
import { StudentPlan, Course } from '../../../../modules/common/data';
import { useFocusableSemesterList } from '../../../../modules/planner/hooks/focusableSemesterList';
import { useCreateNewPlanFlow } from '../../../../modules/planner/hooks/newPlanFlow';
import { usePlanManipulator } from '../../../../modules/planner/hooks/planManipulator';
import { useSelectableCourseDialog } from '../../../../modules/planner/hooks/selectableCourseDialog';
import SemesterNavigationDrawer from '../../SemesterNavigationDrawer';

const useStyles = (columnCount: number) => {
  return makeStyles((theme: Theme) =>
    createStyles({
      root: {
        display: 'flex',
        flexGrow: 1,
      },
      appBar: {
        zIndex: theme.zIndex.drawer + 1,
      },
      drawer: {
        width: 240,
        flexShrink: 0,
      },
      menuButton: {
        marginRight: theme.spacing(2),
      },
      title: {
        flexGrow: 1,
      },
      paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
      },
      semesterListContainer: {
        marginLeft: 180, // TODO: Fix this temporary hack
        backgroundColor: theme.palette.background.paper,
      },
      semesterList: {
        display: 'grid',
        gridGap: theme.spacing(2),
        gridTemplateColumns: `repeat(${columnCount}, calc(50% - 48px))`,
        gridTemplateRows: 'minmax(120px, 1fr)',
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
      },
    }),
  )();
};

/**
 * Component properties for a DegreePlannerChrome.
 */
interface DegreePlannerChromeProps {
  planId: string;
}

/**
 * The root degree planner editor component.
 */
export default function DegreePlannerChrome({ planId }: DegreePlannerChromeProps): JSX.Element {
  const [studentPlan, setStudentPlan] = React.useState<StudentPlan | null>(null);
  const [allCourses, setAllCourses] = React.useState<{ [key: string]: Course }>({});

  console.log('StudentPlan: ', studentPlan);

  // The big kahuna
  const {
    semesters,
    semesterTitles,
    onDragEnd,
    appendNewSemester,
    addCourseToSemester,
    clearSemester,
    removeSemester,
  } = usePlanManipulator(studentPlan);

  const {
    shouldShowDialog: shouldShowAddCourseDialog,
    destinationData: addCourseDialogDestination,
    showDialog: showAddCourseDialog,
    hideDialog,
  } = useSelectableCourseDialog();

  const { focusedSemester, navSemesterData, handleSemesterSelection } =
    useFocusableSemesterList(semesters);

  const { user } = useAuthContext();
  const { plans } = useUserPlanData(user);

  const {
    // planState: newPlanState,
    inNewPlanFlow,
    // goForward,
    // goBack,
    // reset,
  } = useCreateNewPlanFlow();

  // function savePlanState() {
  //   // TODO: Save to persistent store
  //   console.debug('To be implemented');
  // }

  const fetchCourses = async () => {
    const courses = await loadCourses();
    const reduced = courses.slice(0, 50).reduce((acc: { [key: string]: Course }, course) => {
      acc[course.id] = course;
      return acc;
    }, {});
    return reduced;
  };

  const dialogCourses = Object.values(allCourses);

  const getAddSemesterInfoText = () => {
    return 'Have some more classes to take?';
  };

  const handleCoursesSelected = (selected: string[], semesterId: string) => {
    console.log('Selected courses:', selected);
    const courses = selected.map((course) => allCourses[course]);
    addCourseToSemester(semesterId, courses);
    hideDialog();
  };

  const showSemesterInfo = (semesterId: string) => {
    console.log('Not yet implemented.');
    console.debug('Navigating to semester', semesterId);
    // Scroll to block and show info
  };
  // if plan is null, just create a new one

  const handleShowSemesterInfo = (semesterId: string) => {
    // FIXME: This definitely doesn't scale well.
    // const semesterIndex = findSemester(studentPlan?.semesters ?? [], semesterId);
    showSemesterInfo(semesterId);
    handleSemesterSelection(semesterId);
  };

  const classes = useStyles(semesters.length + 1); // +1 accounts for additional AddSemesterTrigger

  const handleAddCourse = (semesterId: string) => {
    showAddCourseDialog({
      name: semesterTitles[semesterId],
      destinationId: semesterId,
    });
  };

  React.useEffect(() => {
    fetchCourses()
      .then((courses) => {
        setAllCourses(courses);
      })
      .catch((error) => {
        console.error('Could not fetch courses', error);
      });
  }, []);

  React.useEffect(() => {
    // Load plan into memory, prepare for modification
    // const loadedPlan = createSamplePlan(4, planId);
    const loadedPlan = plans[planId];
    console.log('Loaded plan: ', loadedPlan);
    setStudentPlan(loadedPlan);
  }, [planId]);

  React.useEffect(() => {
    console.debug('Starting new semester flow');
  }, [inNewPlanFlow]);

  // TODO: Always ensure at least one semester exists in plan

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Your plan
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <SemesterNavigationDrawer
        semesters={navSemesterData}
        focusedSemester={focusedSemester}
        onSemesterSelection={handleSemesterSelection}
      />
      <div className="h-full flex-grow">
        <Toolbar />
        <DragDropContext onDragEnd={onDragEnd}>
          <SemesterBlockList
            semesters={semesters}
            enabled={true}
            onAddCourse={handleAddCourse}
            onClearSemester={clearSemester} // TODO: Probably ask with a confirmation dialog
            onRemoveSemester={removeSemester}
            onShowSemesterInfo={handleShowSemesterInfo}
            direction={ScrollDirection.horizontally}
            focusedSemester={focusedSemester}
          >
            <AddSemesterTrigger
              infoText={getAddSemesterInfoText()}
              onAddSemester={appendNewSemester}
            />
          </SemesterBlockList>
        </DragDropContext>
      </div>
      <AddCourseDialog
        courses={dialogCourses}
        destination={addCourseDialogDestination}
        allowMultiple={true}
        open={shouldShowAddCourseDialog}
        onCancelled={hideDialog}
        onCoursesSelected={handleCoursesSelected}
      />
    </div>
  );
}
