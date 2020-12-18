import React from 'react';

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

/**
 * The root degree planner editor component.
 */
export default function DegreePlannerChrome(props: DegreePlannerChromeProps) {
  const [semesters, setSemesters] = React.useState<Semester[]>([]);

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