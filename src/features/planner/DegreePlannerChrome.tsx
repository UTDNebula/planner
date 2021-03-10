import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core';
import { DragDropContext } from 'react-beautiful-dnd';
// import { useHistory } from 'react-router-dom';
import SemesterNavigationDrawer from './SemesterNavigationDrawer';
import AddSemesterTrigger from './AddSemesterTrigger';
import { StudentPlan, Course /* createSamplePlan */ } from '../../app/data';
import SemesterBlockList, { ScrollDirection } from './SemesterBlockList';
import AddCourseDialog from './AddCourseDialog';
import { useFocusableSemesterList } from './hooks/focusableSemesterList';
import { useObservePlanId } from './hooks/planId';
import { useCreateNewPlanFlow } from './hooks/newPlanFlow';
import { usePlanManipulator } from './hooks/planManipulator';
import { useSelectableCourseDialog } from './hooks/selectableCourseDialog';
import { loadCourses } from '../../api/courses';
import useUserPlanData from '../../components/common/userPlanData';
import { useAuthContext } from '../auth/auth-context';

const useStyles = (columnCount: number) => {
  return makeStyles((theme: Theme) =>
    createStyles({
      root: {
        display: 'flex',
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
 * The root degree planner editor component.
 */
export default function DegreePlannerChrome(): JSX.Element {
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

  const { focusedSemester, navSemesterData, handleSemesterSelection } = useFocusableSemesterList(
    semesters,
  );

  const { planId } = useObservePlanId();

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
      <SemesterNavigationDrawer
        semesters={navSemesterData}
        selected={focusedSemester}
        onSelection={handleSemesterSelection}
      />
      <div className="w-full h-full">
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
