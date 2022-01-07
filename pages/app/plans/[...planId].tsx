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

interface PlanDetailPageProps {
  loadedPlan: StudentPlan;
}

export async function loadCourseAttempts() {
  // TODO: Replace with real user data pulled from firebase
  const data = await import('../../../data/course_attempts.json');

  const courseAttemptData: CourseAttempt[] = Object.values(data['default']).map((elm, index) => {
    const { semester, grade, course } = elm;
    return { semester, grade: grade as Grade, course };
  });
  return courseAttemptData;
}

export async function loadUserSemesters() {
  // TODO: Replace with real user data pulled from firebase
  const data = await import('../../../data/add_courses.json');
  const testSemesters: Semester[] = Object.values(data['default']).map((elm, index) => {
    const { title, code, courses } = elm;
    return { title, code, courses };
  });
  return testSemesters;
}

function savePlan(planId: string, planState: StudentPlan) {
  if (typeof window !== 'undefined') {
    const planJson = JSON.stringify(planState);
    window.localStorage.setItem(planId, planJson);
  }
}

function fetchPlan(planId: string): StudentPlan {
  if (typeof window !== 'undefined') {
    const plan = window.localStorage.getItem(planId); // We're just going to assume the plan ID exists
    return JSON.parse(plan);
  }
}

/**
 * A page that displays the details of a specific student academic plan.
 */
export default function PlanDetailPage({ loadedPlan }: PlanDetailPageProps): JSX.Element {
  // TODO: Replace with custom styles

  const router = useRouter();
  const { planId: planQuery } = router.query;
  const planId = planQuery ? planQuery[0] : 'empty-plan';

  // Load all required data
  const loadData = async () => {
    if (router.isReady) {
      console.log('Loading data');
      const courseAttempts: CourseAttempt[] = await loadCourseAttempts();
      const userSemesters = await loadUserSemesters();
      const tempPlan = {
        id: planId,
        title: 'Just a Degree Plan',
        major: 'Computer Science',
        semesters: userSemesters,
      };

      // Obtains correct plan for situation
      const newPlan = fetchPlan(planId) ?? tempPlan;
      updateLoadedPlan(newPlan);
      setCourseAttempts(courseAttempts);
    }
  };

  // Load data
  React.useEffect(() => {
    loadData();
  }, [router.isReady]);

  // Initial value for plan until data is properly loaded
  const initialPlan = {
    id: planId,
    title: 'Just a Degree Plan',
    major: 'Computer Science',
    semesters: DUMMY_PLAN,
  };

  const [plan, setPlan] = React.useState<StudentPlan>(initialPlan);
  const [courseAttempts, setCourseAttempts] = React.useState<CourseAttempt[]>([]);

  const { exportPlan, handleSelectedPlanChange } = usePlan();

  const { title, setTitle, section, setSection, showTabs, hideTabs, shouldShowTabs } =
    usePlanningToolbar();

  // Function that updates plan when state changes in useDraggableItemContainer hook
  const persistChanges = (data: {
    semesters: Record<string, Semester>;
    // allItems: Array<Course>,
  }) => {
    const semesterList = Object.values(data.semesters);
    const savedPlan = plan;
    savedPlan.semesters = semesterList;
    savePlan(planId, savedPlan);
  };

  const {
    semesters,
    addSemester,
    removeSemester,
    addList,
    updateSemesters,
    handleOnDragEnd,
    setPersist,
    coursesToAddHandler,
    coursesAddedHandler,
    showAddCourseDroppable,
  } = useDraggableItemContainer(plan.semesters, persistChanges);

  /**
   * Re-renders the planner UI with the given plan.
   */
  const updateLoadedPlan = (newPlan: StudentPlan) => {
    console.log('Loading new plan in UI', newPlan);
    setPlan(newPlan);
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
