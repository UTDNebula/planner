import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Fab, Theme } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { makeStyles } from 'tss-react/mui';

import PlannerContainer from '../../../components/planner/PlannerContainer';
import PlanningToolbar, {
  usePlanningToolbar,
} from '../../../components/planner/PlanningToolbar/PlanningToolbar';
import { useSemesterNavigation } from '../../../components/planner/SemesterNavigationDrawer/SemesterNavigationDrawer';
import useSearch from '../../../components/search/search';
import { CourseAttempt } from '../../../modules/auth/auth-context';
import { loadCourseAttempts } from '../../../modules/common/api/courseAttempts';
import { loadDummyCourses } from '../../../modules/common/api/courses';
import { StudentPlan } from '../../../modules/common/data';
import { usePlan } from '../../../modules/planner/hooks/usePlan';
import { usePlannerContainer } from '../../../modules/planner/hooks/usePlannerContainer';

/**
 * Styling for the add & remove semesters buttons
 */
const useStyles = makeStyles()((theme: Theme) => {
  return {
    fabContainer: {
      position: 'absolute',
      top: theme.spacing(8),
      right: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
    },
    fab: {
      margin: '8px',
      backgroundColor: '#1976d2',
    },
  };
});

/**
 * A page that displays the details of a specific student academic plan.
 * // TODO: Decide planner navigation UX
 */
export default function PlanDetailPage(): JSX.Element {
  const router = useRouter();
  const { planId: planQuery } = router.query;
  const planId = planQuery ? planQuery[0] : 'empty-plan';

  const [courseAttempts, setCourseAttempts] = React.useState<CourseAttempt[]>([]);

  const { results, updateQuery, getResults } = useSearch({
    getData: loadDummyCourses,
    initialQuery: '',
    filterFn: (elm, query) => elm['catalogCode'].toLowerCase().includes(query.toLowerCase()),
  });

  const { plan, loadPlan, exportPlan, handleSelectedPlanChange, persistChanges } = usePlan();

  const { title, setTitle, section, setSection, showTabs, hideTabs, shouldShowTabs } =
    usePlanningToolbar(0);

  const {
    semesters,
    addSemester,
    removeSemester,
    updateSemesters,
    handleOnDragEnd,
    removeItemFromList,
    setPersist,
  } = usePlannerContainer(persistChanges, getResults);

  // Load data
  React.useEffect(() => {
    if (router.isReady) {
      const loadData = async () => {
        const newPlan = loadPlan(planId);
        setPersist(true);
        updateSemesters(newPlan.semesters);
        // TODO: Move this logic to custom hook for CourseA
        const courseAttempts: CourseAttempt[] = await loadCourseAttempts();
        setCourseAttempts(courseAttempts);
        setTitle(newPlan.title);
      };
      loadData();
    }
  }, [router.isReady]);

  /**
   * Re-renders the planner UI with the given plan.
   */
  const updateLoadedPlan = (newPlan: StudentPlan) => {
    console.log('Loading new plan in UI', newPlan);
    updateSemesters(newPlan.semesters);
  };

  // TODO: Maybe integrate this with current degree planner
  // if not, then remove
  const navSemesters = plan.semesters;
  const { scrollToSemseter, ...navProps } = useSemesterNavigation(navSemesters);

  const showLeftSidebar = true;
  const handleTabChange = (tabIndex: number) => {
    setSection(tabIndex);
  };

  const { classes } = useStyles();

  const content = (
    <div className="relative overflow-x-hidden">
      <PlannerContainer
        items={semesters}
        onDragEnd={handleOnDragEnd}
        results={results}
        updateQuery={updateQuery}
        removeCourse={removeItemFromList}
      >
        <div className={classes.fabContainer}>
          <Fab color="primary" onClick={() => addSemester()} className={classes.fab}>
            <AddIcon />
          </Fab>
          <Fab color="primary" onClick={() => removeSemester()} className={classes.fab}>
            <RemoveIcon />
          </Fab>
        </div>
      </PlannerContainer>
    </div>
  );

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
        <div className="">{content}</div>
      </div>
    </div>
  );
}
