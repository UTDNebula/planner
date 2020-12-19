import React from 'react';
import { useParams } from 'react-router-dom';

/**
 * Backing data type for a SemesterBlock.
 */
interface Semester {
  title: string;
  code: string;
}

/**
 * Component properties for a {@link DegreePlannerChrome}.
 */
interface DegreePlannerChromeProps {
}

interface AppParams {
  planId: string;
}

/**
 * The root degree planner editor component.
 */
export default function DegreePlannerChrome(props: DegreePlannerChromeProps) {
  const [semesters, setSemesters] = React.useState<Semester[]>([]);


  function loadSchedule(scheduleId: string) {
    const schedule = {
      id: scheduleId,
      title: 'Test schedule',
      major: 'Computer Science',
      semesters: [
        {
          title: '2021 Spring',
          code: '2021s',
        },
        {
          title: '2021 Fall',
          code: '2021f',
        },
        {
          title: '2022 Spring',
          code: '2022s',
        },
      ],
    };
    return schedule;
  }

  const { planId } = useParams<AppParams>();

  React.useEffect(() => {
    // Load schedule into memory, prepare for modification
    const loadedSchedule = loadSchedule(planId);
    const loadedSemesters = loadedSchedule.semesters;
    setSemesters(loadedSemesters);
  }, [planId]);

  const semesterNavList = semesters.map(({ title }) => {
    return (
      <div>
        {title}
      </div>
    );
  });

  return (
    <div>
      <section>
        {/* TODO: Update styling */}
        {/* Sidebar */}
        {semesterNavList}
      </section>
      <div>
        {/* Actual content */}
      </div>
    </div>
  );
}