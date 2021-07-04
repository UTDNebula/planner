import { useRouter } from 'next/router';
import React from 'react';
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
import { Semester, StudentPlan } from '../../../modules/common/data';
import StudentHistoryView from '../../../components/planner/history/StudentHistoryView';
import { CourseAttempt } from '../../../modules/auth/auth-context';
import AddSemesterTrigger from '../../../components/planner/AddSemesterTrigger';
import { usePlan } from '../../../modules/planner/hooks/usePlan';

const COURSE_ATTEMPTS: CourseAttempt[] = [
  {
    semester: '2019f',
    grade: 'A-',
    course: {
      id: '0001',
      title: 'Introduction to Engineering and Computer Science',
      catalogCode: 'ECS 1100',
      description: 'Course description',
      creditHours: 1,
    },
  },
  {
    semester: '2019f',
    grade: 'A-',
    course: {
      id: '0002',
      title: 'Introduction to Computer Science and Software Engineering',
      catalogCode: 'CS 1200',
      description: 'Course description',
      creditHours: 2,
    },
  },
  {
    semester: '2019f',
    grade: 'A-',
    course: {
      id: '0003',
      title: 'Discrete Mathematics for Computing I',
      catalogCode: 'CS 2305',
      description: 'Course description',
      creditHours: 3,
    },
  },
  {
    semester: '2019f',
    grade: 'B',
    course: {
      id: '0004',
      title: 'Computer Science II',
      catalogCode: 'CS 2337',
      description: 'Course description',
      creditHours: 3,
    },
  },
  {
    semester: '2019f',
    grade: 'B',
    course: {
      id: '0006',
      title: 'Calculus I',
      catalogCode: 'MATH 2417',
      description: 'Course description',
      creditHours: 4,
    },
  },
  {
    semester: '2019f',
    grade: 'B-',
    course: {
      id: '0005',
      title: 'State and Local Government',
      catalogCode: 'GOVT 2306',
      description: 'Course description',
      creditHours: 3,
    },
  },
];

const TEST_SEMESTERS: Semester[] = [
  {
    title: 'Fall 2021',
    code: '2021f',
    courses: [
      {
        id: '0001',
        title: 'Test Course 1 2021f',
        catalogCode: 'UNIV 1010',
        description: 'Course description',
        creditHours: 0,
      },
      {
        id: '0002',
        title: 'Test Course 2 2021f',
        catalogCode: 'UNIV 1011',
        description: 'Course description',
        creditHours: 0,
      },
      {
        id: '0003',
        title: 'Test Course 3 2021f',
        catalogCode: 'UNIV 1012',
        description: 'Course description',
        creditHours: 0,
      },
    ],
  },
  {
    title: 'Spring 2022',
    code: '2022s',
    courses: [
      {
        id: '0011',
        title: 'Test Course 1 2022s',
        catalogCode: 'UNIV 2010',
        description: 'Course description',
        creditHours: 0,
      },
      {
        id: '0012',
        title: 'Test Course 2 2022s',
        catalogCode: 'UNIV 2011',
        description: 'Course description',
        creditHours: 0,
      },
      {
        id: '0013',
        title: 'Test Course 3 2022s',
        catalogCode: 'UNIV 2012',
        description: 'Course description',
        creditHours: 0,
      },
    ],
  },
  {
    title: 'Fall 2022',
    code: '2022f',
    courses: [
      {
        id: '0021',
        title: 'Test Course 1 2022f',
        catalogCode: 'UNIV 3010',
        description: 'Course description',
        creditHours: 0,
      },
      {
        id: '0022',
        title: 'Test Course 2 2022f',
        catalogCode: 'UNIV 3011',
        description: 'Course description',
        creditHours: 0,
      },
      {
        id: '0023',
        title: 'Test Course 3 2022f',
        catalogCode: 'UNIV 3012',
        description: 'Course description',
        creditHours: 0,
      },
    ],
  },
];

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

interface PlanDetailPageProps {
  loadedPlan: StudentPlan;
}

/**
 * A page that displays the details of a specific student academic plan.
 */
export default function PlanDetailPage({ loadedPlan }: PlanDetailPageProps): JSX.Element {
  // TODO: Replace with custom styles

  const router = useRouter();
  const { planId: planQuery } = router.query;
  console.log(router.query);
  const planId = planQuery ? planQuery[0] : 'empty-plan';

  const tempPlan = {
    id: planId,
    title: 'Just a Degree Plan',
    major: 'Computer Science',
    semesters: TEST_SEMESTERS,
  };

  const [plan, setPlan] = React.useState<StudentPlan>(tempPlan);

  const persistChanges = (data: {
    semesters: Record<string, Semester>;
    // allItems: Array<Course>,
  }) => {
    const semesterList = Object.values(data.semesters);
    const savedPlan = plan;
    savedPlan.semesters = semesterList;
    savePlan(planId, savedPlan);
  };

  const courseAttempts = COURSE_ATTEMPTS;

  const { title, setTitle, section, setSection, showTabs, hideTabs, shouldShowTabs } =
    usePlanningToolbar();

  console.log('Plan:', plan);
  const { semesters, addList, updateSemesters, handleOnDragEnd } = useDraggableItemContainer(
    plan.semesters,
    persistChanges,
  );

  const { exportPlan } = usePlan();

  React.useEffect(() => {
    // Just a test
    const newPlan = fetchPlan(planId) ?? tempPlan;
    setPlan(newPlan);
    updateSemesters(newPlan.semesters);
  }, [planId]);

  const navSemesters = plan.semesters;
  const { scrollToSemseter, ...navProps } = useSemesterNavigation(navSemesters);

  const showLeftSidebar = true;

  let content;
  switch (section) {
    case 0: // Overview
      content = <div className="p-2 text-center">Plan Overview</div>;
      break;
    case 1: // Plan
      content = (
        <div className="h-full md:grid md:grid-cols-12">
          {showLeftSidebar && (
            <nav className="h-full md:col-start-1 md:col-end-3 bg-gray-200 ">
              {semesters.map(({ title, code }: Semester) => {
                return (
                  <div className="p-4 bg-gray-300" key={code}>
                    {title}
                  </div>
                );
              })}
            </nav>
          )}
          <div className="h-full md:col-span-9">
            <DraggableItemContainer items={semesters} onDragEnd={handleOnDragEnd}>
              <AddSemesterTrigger
                infoText={'Add another semester'}
                onAddSemester={() => {
                  // TODO: Put into hook
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

  const handleTabChange = (tabIndex: number) => {
    setSection(tabIndex);
  };

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

// export async function getStaticPaths() {
//   return {
//     paths: [],
//     fallback: false,
//   };
// }

// export async function getStaticProps({ params }) {
//   const { id: planId } = params;
//   return {
//     loadedPlan: {},
//   };
// }
