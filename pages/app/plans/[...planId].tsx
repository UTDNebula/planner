import { CircularProgress, Dialog, Theme } from '@mui/material';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';

import ErrorMessage from '../../../components/common/ErrorMessage';
import WarningMessageModal from '../../../components/common/WarningMessageModal';
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
import { RootState } from '../../../modules/redux/store';

/**
 * Styling for the add & remove semesters buttons
 */
const useStyles = makeStyles()((theme: Theme) => {
  return {
    fabContainer: {
      position: 'fixed',
      top: theme.spacing(16),
      right: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
    },
    fab: {
      margin: '8px',
      backgroundColor: '#3E61ED',
      '&:hover': {
        backgroundColor: '#0040AF',
      },
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

  const [warning, setWarning] = React.useState(false);

  const [courseAttempts, setCourseAttempts] = React.useState<CourseAttempt[]>([]);

  const { results, updateQuery, getResults, err } = useSearch({
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

  const updateOverride = (id: string) => {
    // Find course & update it
    const newSemesters = semesters.map((semester) => {
      const newCourses = semester.courses.map((course, idx) => {
        if (course.id === id) {
          if (course.validation.override === false)
            return { ...course, validation: { isValid: true, override: true } };
          else return { ...course, validation: { isValid: false, override: false } };
        }
        return course;
      });
      return { ...semester, courses: newCourses };
    });
    updateSemesters(newSemesters);
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
    <PlannerContainer
      items={semesters}
      onDragEnd={handleOnDragEnd}
      results={results}
      updateQuery={updateQuery}
      removeCourse={removeItemFromList}
      updateOverride={updateOverride}
      addSemester={addSemester}
      removeSemester={removeSemester}
    ></PlannerContainer>
  );
  const openValidationModal = () => {
    setShowValidation(true);
  };
  const [showValidation, setShowValidation] = useState(false);
  return (
    <>
      <ValidationDialog
        planId={planId}
        open={showValidation}
        onClose={() => setShowValidation(false)}
      />
      <div className="flex flex-col h-[calc(100vh-50px)] overflow-y-hidden">
        <div className="flex-none">
          {err !== undefined && ErrorMessage(err)}
          <PlanningToolbar
            setPlanTitle={setTitle}
            planId={plan.id}
            sectionIndex={section}
            planTitle={title}
            shouldShowTabs={shouldShowTabs}
            onTabChange={handleTabChange}
            onValidate={openValidationModal}
            updateSemesters={updateSemesters}
            onExportPlan={() => {
              console.log('Exporting plan');
              exportPlan(plan);
            }}
            onImportPlan={(event) => {
              handleSelectedPlanChange(event, updateLoadedPlan);
            }}
          />
        </div>
        <div className="flex-1">{content}</div>
      </div>
      {warning && (
        <WarningMessageModal
          message="Insert possible warning/message here"
          setWarning={setWarning}
        />
      )}
    </>
  );
}

// TODO: Refactor everything below this line into a separate file

const ValidationDialog = (props: { open: boolean; onClose: () => void; planId: string }) => {
  const { open, onClose, planId } = props;

  const plan = useSelector((state: RootState) => state.userData.plans[planId]);

  const major = plan !== undefined ? plan.major : '';

  // TODO: Clean up this reformatting logic
  // Change major name to one appropriate for API
  // Major names can be found here: https://github.com/ez314/Degree-Validator/tree/main/requirements
  const formattedMajor = `${major.split(' ').join('_').toLowerCase()}_bs`;
  // alert(formattedMajor);

  const [loading, setLoading] = useState(true);
  const [outputData, setOutputData] = useState<DVResponse>(null);
  const ac = new AbortController();
  const performValidation = async () => {
    const body: DVRequest = {
      courses: plan.semesters
        .flatMap((s) => s.courses)
        .map((c) => {
          const split = c.catalogCode.split(' ');
          const department = split[0];
          const courseNumber = Number(split[1]);
          const level = Math.floor(courseNumber / 1000);
          const hours = Math.floor((courseNumber - level * 1000) / 100);
          return {
            name: c.catalogCode,
            department: department,
            level,
            hours,
          };
        }),
      bypasses: [],
      degree: formattedMajor,
    };

    body.courses = body.courses.filter((course) => course.name !== '');

    const res = await await fetch(
      `${process.env.NEXT_PUBLIC_VALIDATION_SERVER}/validate-degree-plan`,
      {
        method: 'POST',
        body: JSON.stringify(body),
        signal: ac.signal,
        headers: {
          'content-type': 'application/json',
        },
      },
    );

    const response = (await res.json()) as DVResponse;

    if (res.status === 200) {
      setOutputData(response);
      setLoading(false);
    } else if (res.status === 404) {
      res.status === 404
        ? alert(
            'This major is not yet supported! If you want to help us support degree plan validation for more majors, check out this link: https://forms.gle/1KeszKHRkooVjyxn9',
          )
        : alert('An error has occured');
      onClose();
    }
  };
  useEffect(() => {
    if (!open) {
      setLoading(true);
      return;
    }
    performValidation();
    return () => ac.abort();
  }, [open]);
  return (
    <Dialog open={open} onClose={onClose}>
      <div className="p-10">
        <h1>Degree Validation</h1>

        {loading ? (
          <CircularProgress />
        ) : (
          <ul className="list-disc">
            {Object.entries(outputData).map(([key, value]) => {
              return (
                <li className="my-2" key={key}>
                  <div className="flex justify-between">
                    <p className="font-bold">{key}</p>{' '}
                    <p className="text-right">
                      {value.isfilled ? `Complete` : `Incomplete`} ({value.hours} credits)
                    </p>
                  </div>
                  <ul className="ml-4 list-disc">
                    {Object.keys(value.courses).length != 0 ? (
                      Object.entries(value.courses).map(([course, credits]) => (
                        <li key={course}>
                          {course} - {credits} credits
                        </li>
                      ))
                    ) : (
                      <li className="italic">No credits planned for this requirement.</li>
                    )}
                  </ul>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Dialog>
  );
};

interface DVRequest {
  courses: DVCourse[];
  bypasses: DVBypass[];
  degree: string;
}

interface DVResponse {
  [requirement: string]: DVRequirement;
}

interface DVRequirement {
  courses: Record<string, number>;
  hours: number;
  isfilled: boolean;
}

interface DVBypass {
  course: string;
  requirement: string;
  hours: number;
}

interface DVCourse {
  name: string;
  department: string;
  level: number;
  hours: number;
}
