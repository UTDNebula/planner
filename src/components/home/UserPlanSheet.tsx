import React from 'react';
import { Close, KeyboardArrowUp } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Course, createSamplePlan } from '../../app/data';
import useUserPlanData from '../common/userPlanData';
import { useAuthContext } from '../../features/auth/auth-context';
import CourseCard from '../common/CourseCard';
/**
 * Component props for a UserPlanSheet.
 */
interface UserPlanSheetProps {
  /**
   * True if the plan is in an expanded state.
   */
  isOpen: boolean;

  /**
   * A callback triggered when a plan is opened.
   */
  onExpandClick: (planId: string) => void;
}

/**
 * A sheet that displays the current semester and upcoming semesters.
 */
export default function UserPlanSheet({ isOpen, onExpandClick }: UserPlanSheetProps): JSX.Element {
  // TODO: Find out if this is the right place to put the reference to auth
  const { user } = useAuthContext();
  const { plans, planIds } = useUserPlanData(user);
  // const plan = plans[0];
  const plan = createSamplePlan(5);

  const startSemester = 0;

  // TODO: Determine next semester using current semester
  const currentSemester = plan.semesters[startSemester];
  console.log(plan);

  const laterSemesters = plan.semesters.slice(startSemester + 1);

  const generateListStyle = () => {
    // overflow-x-hidden flex
    return {
      'overflow-x': 'auto',
      'grid-auto-flow': 'column',
      display: 'grid',
      'grid-gap': '4px',
      'grid-auto-columns': 'calc(50% - 24px)',
      padding: '2px',
    };
  };

  function CourseList(courses: Course[]): JSX.Element[] {
    return courses.map(({ id, catalogCode, title, description, creditHours }) => {
      return (
        <CourseCard
          key={id}
          code={catalogCode}
          title={title}
          description={description}
          creditHours={creditHours}
          enabled={false}
        />
      );
    });
  }

  const handlePlanToggle = () => {
    // TODO: Animate button
    const planId = plan.id;
    onExpandClick(planId);
  };

  const icon = isOpen ? <Close /> : <KeyboardArrowUp />;

  return (
    <div className="bg-white w-screen">
      <header className="flex p-2">
        <div className="inline-block">
          <IconButton
            aria-label={isOpen ? 'Close plan' : 'Open plan'}
            color="primary"
            // component={Link}
            // to="/app/plans/new"
            onClick={handlePlanToggle}
          >
            {icon}
          </IconButton>
        </div>
        <Link className="ml-2 text-headline5 flex-1 my-auto" to={`/app/plans/${plan.id}`}>
          Your plan
        </Link>
      </header>
      <div className="md:flex">
        <div className="p-2 flex-0">
          <div className="text-headline6 mx-4">This semester</div>
          <div className="max-w-sm w-full rounded-md" key={currentSemester.code}>
            <header className="px-4 py-2 mx-2 mt-2 border-gray-200 border rounded-md">
              <span className="text-subtitle1 font-bold">{currentSemester.title}</span>
            </header>
            <div className="px-2">{CourseList(currentSemester.courses)}</div>
          </div>
        </div>
        <div className="p-2 flex-1">
          <div className="text-headline6 mx-4">What&apos;s next</div>
          <div style={generateListStyle()}>
            {laterSemesters.map((semester) => {
              return (
                <div key={semester.code} className="max-h-full inline-block align-top">
                  <div className="max-w-sm w-full rounded-md">
                    <header className="px-4 py-2 mx-2 mt-2 border-gray-200 border rounded-md">
                      <span className="text-subtitle1 font-bold">{semester.title}</span>
                    </header>
                    <div className="px-2">{CourseList(semester.courses)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
