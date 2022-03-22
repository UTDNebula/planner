import React from "react";
import { Close, KeyboardArrowUp } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import Link from "next/link";
import useUserPlanData from "../../modules/redux/userPlanData";
import CourseCard from "../common/CourseCard";
import { useAuthContext } from "../../modules/auth/auth-context";
import { Course } from "../../modules/common/data";
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
 * A list of CourseCard components.
 *
 * @param courses The courses to display
 */
function CourseList(courses: Course[]): JSX.Element[] {
  return courses.map(({ id, catalogCode, title, description, creditHours }) => {
    return (
      <CourseCard
        id={id}
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

/**
 * A sheet that displays the current semester and upcoming semesters.
 */
export default function UserPlanSheet({
  isOpen,
  onExpandClick,
}: UserPlanSheetProps): JSX.Element {
  // TODO: Find out if this is the right place to put the reference to auth
  const { user } = useAuthContext();
  const { plans } = useUserPlanData(user);
  const planIds = Object.keys(plans);
  const plan = plans[planIds[0]];

  const handlePlanToggle = () => {
    // TODO: Animate button
    const planId = plan.id;
    onExpandClick(planId);
  };

  let sheetContents;
  if (plan) {
    const startSemester = 0;

    const semesters = plan.semesters ?? [];
    // TODO: Determine next semester using current semester
    const currentSemester = semesters[startSemester];
    // TODO: Fix this obvious index 0 code smell
    console.log(plan);

    const laterSemesters = semesters.slice(startSemester + 1);

    sheetContents = (
      <>
        <div className="p-2 flex-0">
          <div className="text-headline6 mx-4">This semester</div>
          <div
            className="max-w-sm w-full rounded-md"
            key={currentSemester.code}
          >
            <header className="px-4 py-2 mx-2 mt-2 border-gray-200 border rounded-md">
              <span className="text-subtitle1 font-bold">
                {currentSemester.title}
              </span>
            </header>
            <div className="px-2">{CourseList(currentSemester.courses)}</div>
          </div>
        </div>
        <div className="p-2 flex-1">
          <div className="text-headline6 mx-4">What&apos;s next</div>
          <div
            style={{
              overflowX: "auto",
              gridAutoFlow: "column",
              display: "grid",
              gridGap: "4px",
              gridAutoColumns: "calc(50% - 24px)",
              padding: "2px",
            }}
          >
            {laterSemesters.map((semester) => {
              return (
                <div
                  key={semester.code}
                  className="max-h-full inline-block align-top"
                >
                  <div className="max-w-sm w-full rounded-md">
                    <header className="px-4 py-2 mx-2 mt-2 border-gray-200 border rounded-md">
                      <span className="text-subtitle1 font-bold">
                        {semester.title}
                      </span>
                    </header>
                    <div className="px-2">{CourseList(semester.courses)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  } else {
    sheetContents = (
      <div className="w-full p-4 text-center">
        <div className="mx-auto">
          <div className="text-headline6 font-bold">
            It appears you don&apos;t have a plan yet. Let&apos;s change that.
          </div>
          <div className="flex justify-center my-4">
            <Button variant="contained" color="primary">
              <Link href="/app/plans/new">Create a plan</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const icon = isOpen ? <Close /> : <KeyboardArrowUp />;

  const planLink = plan ? `/app/plans/${plan.id}` : "";

  return (
    <div className="bg-white w-full">
      <header className="flex p-2">
        <div className="inline-block">
          <IconButton
            aria-label={isOpen ? "Close plan" : "Open plan"}
            color="primary"
            // component={Link}
            // to="/app/plans/new"
            onClick={handlePlanToggle}
            size="large"
          >
            {icon}
          </IconButton>
        </div>
        <Link href={planLink}>
          <span className="ml-2 text-headline5 flex-1 my-auto">Your plan</span>
        </Link>
      </header>
      <div className="md:flex">{sheetContents}</div>
    </div>
  );
}
