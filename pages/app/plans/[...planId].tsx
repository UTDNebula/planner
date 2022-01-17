import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import DraggableItemContainer, {
  getUpdatedSemesterData,
  useDraggableItemContainer,
} from '../../../components/planner/DraggablebleItemContainer';
import PlanningToolbar, {
  usePlanningToolbar,
} from '../../../components/planner/PlanningToolbar/PlanningToolbar';
import SemesterNavigationDrawer, {
  useSemesterNavigation,
} from '../../../components/planner/SemesterNavigationDrawer/SemesterNavigationDrawer';
import { Course, Grade, Semester, StudentPlan } from '../../../modules/common/data';
import StudentHistoryView from '../../../components/planner/history/StudentHistoryView';
import { CourseAttempt } from '../../../modules/auth/auth-context';
import AddSemesterTrigger from '../../../components/planner/AddSemesterTrigger';
import { usePlan } from '../../../modules/planner/hooks/usePlan';
import CourseSelector from '../../../components/planner/CourseSelector/CourseSelector';
import DUMMY_PLAN from '../../../data/add_courses.json';
import { loadCourseAttempts } from '../../../modules/common/api/courseAttempts';

interface PlanDetailPageProps {
  loadedPlan: StudentPlan;
}

/**
 * A page that displays the details of a specific student academic plan.
 */
export default function PlanDetailPage({ loadedPlan }: PlanDetailPageProps): JSX.Element {
  const router = useRouter();
  const { planId: planQuery } = router.query;
  const planId = planQuery ? planQuery[0] : 'empty-plan';

  // Load all required data
  const loadData = async () => {
    if (router.isReady) {
      const newPlan = loadPlan(planId);
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
    usePlanningToolbar();

  const {
    semesters,
    addSemester,
    removeSemester,
    updateSemesters,
    handleOnDragEnd,
    coursesToAddHandler,
    coursesAddedHandler,
    setPersist,
    showAddCourseDroppable,
  } = useDraggableItemContainer(plan.semesters, persistChanges);

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

  // This controls what to render based on what tab state
  let content;
  switch (section) {
    case 0: // Overview
      content = <div className="p-2 text-center">Plan Overview</div>;
      break;
    case 1: // Plan
      content = (
        <div className="h-full md:grid md:grid-cols-12">
          {showLeftSidebar && (
            <div className="md:col-span-3">
              <CourseSelector
                coursesToAddHandler={coursesToAddHandler}
                coursesAddedHandler={coursesAddedHandler}
              />
            </div>
          )}
          <div className="h-full md:col-span-9">
            <DraggableItemContainer items={semesters} onDragEnd={handleOnDragEnd}>
              <AddSemesterTrigger
                infoText={'Add another semester'}
                onAddSemester={() => {
                  addSemester();
                }}
              />{' '}
              {/* Change component name */}
              <AddSemesterTrigger
                infoText={'Remove semester'}
                onAddSemester={() => {
                  removeSemester();
                }}
              />
            </DraggableItemContainer>
          </div>
        </div>
      );
      break;
    case 2: // Requirements
      content = <div className="p-2 text-center">Requirements</div>;
      break;
    case 3: // History
      content = (
        <div className="min-h-full">
          <StudentHistoryView attempts={courseAttempts} />
        </div>
      );
      break;
    default:
      console.error('Unknown tab index');
      break;
  }

  return (
    <div className="h-screen w-full flex flex-col">
      <div className="flex-none">
        <PlanningToolbar
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
        <div className="h-full">{content}</div>
      </div>
    </div>
  );
}
