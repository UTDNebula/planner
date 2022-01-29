import { createStyles, Fab, makeStyles, Theme } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { useRouter } from 'next/router';
import React from 'react';
import DraggableItemContainer, {
  useDraggableItemContainer,
} from '../../../components/planner/DraggablebleItemContainer';
import PlanningToolbar, {
  usePlanningToolbar,
} from '../../../components/planner/PlanningToolbar/PlanningToolbar';
import { useSemesterNavigation } from '../../../components/planner/SemesterNavigationDrawer/SemesterNavigationDrawer';
import useSearch from '../../../components/search/search';
import { CourseAttempt } from '../../../modules/auth/auth-context';
import { loadCourseAttempts } from '../../../modules/common/api/courseAttempts';
import { loadCourses } from '../../../modules/common/api/courses';
import { StudentPlan } from '../../../modules/common/data';
import { usePlan } from '../../../modules/planner/hooks/usePlan';

interface PlanDetailPageProps {
  loadedPlan: StudentPlan;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fabContainer: {
      position: 'absolute',
      top: theme.spacing(8),
      right: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
    },
    fab: {
      margin: '8px',
    },
  }),
);

/**
 * A page that displays the details of a specific student academic plan.
 */
export default function PlanDetailPage({ loadedPlan }: PlanDetailPageProps): JSX.Element {
  const router = useRouter();
  const { planId: planQuery } = router.query;

  const planId = planQuery ? planQuery[0] : 'empty-plan';

  const { results, updateQuery, getResults } = useSearch({
    getData: loadCourses,
    filterBy: 'catalogCode',
  });

  console.log('ID', planId);

  // Load all required data
  const loadData = async () => {
    if (router.isReady) {
      const newPlan = loadPlan(planId);
      console.log('NEW PLAN', newPlan);
      setPersist(true);
      updateSemesters(newPlan.semesters);
      const courseAttempts: CourseAttempt[] = await loadCourseAttempts();
      setCourseAttempts(courseAttempts);
    }
  };

  // Load data
  React.useEffect(() => {
    loadData();
  }, [router.isReady]);

  const [courseAttempts, setCourseAttempts] = React.useState<CourseAttempt[]>([]);

  const { plan, loadPlan, exportPlan, handleSelectedPlanChange, persistChanges } = usePlan();

  const { title, setTitle, section, setSection, showTabs, hideTabs, shouldShowTabs } =
    usePlanningToolbar(0, plan.title);

  const {
    semesters,
    addSemester,
    removeSemester,
    updateSemesters,
    handleOnDragEnd,
    removeItemFromList,
    coursesToAddHandler,
    coursesAddedHandler,
    setPersist,
    showAddCourseDroppable,
  } = useDraggableItemContainer(plan.semesters, persistChanges, getResults);

  /**
   * Re-renders the planner UI with the given plan.
   */
  const updateLoadedPlan = (newPlan: StudentPlan) => {
    console.log('Loading new plan in UI', newPlan);
    updateSemesters(newPlan.semesters);
  };

  /* Tab Navigation code */
  const navSemesters = plan.semesters;
  const { scrollToSemseter, ...navProps } = useSemesterNavigation(navSemesters);

  const showLeftSidebar = true;
  const handleTabChange = (tabIndex: number) => {
    setSection(tabIndex);
  };

  const classes = useStyles();

  // This controls what to render based on what tab state
  let content;
  switch (section) {
    case 0: // Overview
      // content = <div className="p-2 text-center">Plan Overview</div>;
      // break;
      // case 1: // Plan
      content = (
        <div className="relative overflow-x-hidden">
          <DraggableItemContainer
            items={semesters}
            onDragEnd={handleOnDragEnd}
            results={results}
            updateQuery={updateQuery}
            removeCourse={removeItemFromList}
          ></DraggableItemContainer>
          <div className={classes.fabContainer}>
            <Fab color="primary" onClick={() => addSemester()} className={classes.fab}>
              <AddIcon />
            </Fab>
            <Fab color="primary" onClick={() => removeSemester()} className={classes.fab}>
              <RemoveIcon />
            </Fab>
          </div>
        </div>
      );
      break;
    // case 1:
    //   content = <div className="p-2 text-center">More features coming soon!</div>;
    // case 2: // Requirements
    //   content = <div className="p-2 text-center">Requirements</div>;
    //   break;
    // case 3: // History
    //   content = (
    //     <div className="">
    //       <StudentHistoryView attempts={courseAttempts} />
    //     </div>
    //   );
    //   break;

    default:
      console.error('Unknown tab index');
      break;
  }

  return (
    <div className="h-full flex flex-col overflow-x-hidden overflow-y-auto">
      <div className="flex-none">
        <PlanningToolbar
          setPlanTitle={setTitle}
          planId={plan.id}
          sectionIndex={section}
          planTitle={title}
          shouldShowTabs={shouldShowTabs}
          onTabChange={handleTabChange}
          onExportPlan={() => {
            console.log('Exporting plan');
            exportPlan(plan);
          }}
          onImportPlan={(event) => {
            handleSelectedPlanChange(event, updateLoadedPlan);
          }}
        />
      </div>
      <div className="flex-1">
        {/* <Toolbar /> */}
        {/* TODO: Fix margin*/}
        <div className="">{content}</div>
      </div>
    </div>
  );
}
