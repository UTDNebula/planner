import { NextPage } from 'next';
import { useState } from 'react';

import { Course, PlannerTool, Semester } from '@/components/planner2/Planner';

const Test3Page: NextPage = () => {
  const courses: Course[] = [
    { id: '1', name: 'ECS 1110' },
    { id: '2', name: 'CS 1337' },
  ];
  const [semesters, setSemesters] = useState<Semester[]>([
    {
      id: '1',
      name: "Fall'22",
      courses: [{ id: '3', name: 'CS 2305', validation: { isValid: false, override: false } }],
    },
    { id: '2', name: "Spring'23", courses: [] },
    { id: '3', name: "Summer'23", courses: [] },
  ]);

  return (
    <div className="w-screen h-screen bg-[#FFFBF7]">
      <PlannerTool
        courses={courses}
        semesters={semesters}
        onAddCourseToSemester={async (targetSemester, newCourse) => {
          // check for duplicate course
          const isDuplicate = Boolean(
            targetSemester.courses.find((course) => course.id === newCourse.id),
          );
          if (isDuplicate) {
            return {
              level: 'warn',
              message: `You're already taking ${newCourse.name} in ${targetSemester.name}`,
            };
          }

          setSemesters((semesters) =>
            semesters.map((semester) =>
              semester.id === targetSemester.id
                ? { ...semester, courses: [...semester.courses, newCourse] }
                : semester,
            ),
          );

          return { level: 'ok', message: `Added ${newCourse.name} to ${targetSemester.name}` };
        }}
        onMoveCourseFromSemesterToSemester={async (
          originSemester,
          destinationSemester,
          courseToMove,
        ) => {
          // check for duplicate course
          const isDuplicate = Boolean(
            destinationSemester.courses.find((course) => course.id === courseToMove.id),
          );
          if (isDuplicate) {
            return {
              level: 'warn',
              message: `You're already taking ${courseToMove.name} in ${destinationSemester.name}`,
            };
          }

          setSemesters((semesters) =>
            semesters.map((semester) => {
              if (semester.id === destinationSemester.id) {
                return { ...semester, courses: [...semester.courses, courseToMove] };
              }

              if (semester.id === originSemester.id) {
                return {
                  ...semester,
                  courses: semester.courses.filter((course) => course.id !== courseToMove.id),
                };
              }

              return semester;
            }),
          );

          return {
            level: 'ok',
            message: `Moved ${courseToMove.name} from ${originSemester.name} to ${destinationSemester.name}`,
          };
        }}
      />
    </div>
  );
};

export default Test3Page;
