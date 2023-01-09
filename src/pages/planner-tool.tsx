import { NextPage } from 'next';
import { useState } from 'react';

import Planner from '@/components/planner/Planner';
import { DegreeRequirementGroup,Semester } from '@/components/planner/types';
import validationData from '@/data/dummyValidation.json';

const Test3Page: NextPage = () => {
  const [degreeData, setDegreeData] = useState<DegreeRequirementGroup[]>(validationData);

  const [semesters, setSemesters] = useState<Semester[]>([
    {
      id: '1',
      name: "Fall'22",
      courses: [
        {
          id: '3',
          catalogCode: 'CS 2305',
          creditHours: 10,
          description: '',
          title: 'Discrete Math',
          validation: { isValid: true, override: false },
        },
      ],
    },
    { id: '2', name: "Spring'23", courses: [] },
    { id: '3', name: "Summer'23", courses: [] },
    {
      id: '4',
      name: "Fall'23",
      courses: [
        {
          id: '3',
          catalogCode: 'CS 2305',
          creditHours: 10,
          description: '',
          title: 'Discrete Math',
          validation: { isValid: false, override: false },
        },
      ],
    },
    { id: '5', name: "Spring'24", courses: [] },
    { id: '6', name: "Summer'24", courses: [] },
    {
      id: '7',
      name: "Fall'24",
      courses: [],
    },
    { id: '8', name: "Spring'25", courses: [] },
    { id: '9', name: "Summer'25", courses: [] },
    {
      id: '10',
      name: "Fall'25",
      courses: [],
    },
    { id: '11', name: "Spring'26", courses: [] },
    { id: '12', name: "Summer'26", courses: [] },
  ]);

  return (
    <div className="w-screen max-h-screen h-screen overflow-hidden bg-[#FFFFFF] p-[44px]">
      <Planner
        degreeRequirements={degreeData}
        semesters={semesters}
        onRemoveCourseFromSemester={async (targetSemester, targetCourse) => {
          setSemesters((semesters) =>
            semesters.map((semester) => {
              if (semester.id === targetSemester.id) {
                return {
                  ...semester,
                  courses: semester.courses.filter((course) => course.id !== targetCourse.id),
                };
              }

              return semester;
            }),
          );
          return {
            level: 'ok',
            message: `Removed ${targetCourse.catalogCode} from ${targetSemester.name}`,
          };
        }}
        onAddCourseToSemester={async (targetSemester, newCourse) => {
          // check for duplicate course
          const isDuplicate = Boolean(
            targetSemester.courses.find((course) => course.catalogCode === newCourse.catalogCode),
          );
          if (isDuplicate) {
            return {
              level: 'warn',
              message: `You're already taking ${newCourse.catalogCode} in ${targetSemester.name}`,
            };
          }

          setSemesters((semesters) =>
            semesters.map((semester) =>
              semester.id === targetSemester.id
                ? { ...semester, courses: [...semester.courses, newCourse] }
                : semester,
            ),
          );

          return {
            level: 'ok',
            message: `Added ${newCourse.catalogCode} to ${targetSemester.name}`,
          };
        }}
        onMoveCourseFromSemesterToSemester={async (
          originSemester,
          destinationSemester,
          courseToMove,
        ) => {
          // check for duplicate course
          const isDuplicate = Boolean(
            destinationSemester.courses.find(
              (course) => course.catalogCode === courseToMove.catalogCode,
            ),
          );
          if (isDuplicate) {
            return {
              level: 'warn',
              message: `You're already taking ${courseToMove.catalogCode} in ${destinationSemester.name}`,
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
            message: `Moved ${courseToMove.catalogCode} from ${originSemester.name} to ${destinationSemester.name}`,
          };
        }}
      />
    </div>
  );
};

export default Test3Page;
