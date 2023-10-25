import React, { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { trpc } from '@/utils/trpc';

import Accordion from './Accordion';
import DraggableSidebarCourseItem from './SidebarCourseItem';
import { CourseRequirement, RequirementTypes } from './types';

/**
 * Group of requirements that's recursive?
 * @param param0
 * @returns
 */
export function RecursiveRequirement({
  req,
  courses,
  validCourses = {},
}: {
  req: RequirementTypes;
  courses: string[];
  validCourses: { [key: string]: number };
}) {
  const getRequirement = () => {
    switch (req.matcher) {
      case 'Course':
        return (
          <CourseRequirementComponent req={req} courses={courses} validCourses={validCourses} />
        );
      case 'Or':
        return (
          <div className="rounded-md border border-neutral-300 p-4">
            <Accordion
              header={<div className="font-medium">Select one of the following options</div>}
              filled={req.filled}
            >
              <>
                {req.requirements.map((req2, idx) => (
                  <>
                    <div className="h-2 px-2 text-sm">Option {idx + 1}</div>
                    <RecursiveRequirement
                      key={idx}
                      req={req2}
                      courses={courses}
                      validCourses={validCourses}
                    />
                  </>
                ))}
              </>
            </Accordion>
          </div>
        );
      case 'And':
        return (
          <div className="flex flex-col rounded-md border border-neutral-300 p-4">
            <Accordion
              header={<div className="font-medium">Select all of the following options</div>}
              filled={req.filled}
            >
              <>
                {req.requirements.map((req2, idx) => (
                  <>
                    <RecursiveRequirement
                      key={idx}
                      req={req2}
                      courses={courses}
                      validCourses={validCourses}
                    />
                  </>
                ))}
              </>
            </Accordion>
          </div>
        );
      case 'Select':
        return (
          <div className=" rounded-md border border-neutral-300 p-4">
            <Accordion
              header={
                <div className="font-medium">
                  Select {req.required_count} of the following options
                </div>
              }
              filled={req.filled}
            >
              <>
                {req.requirements.map((req2, idx) => (
                  <>
                    <div className="h-2 px-2 text-sm">Option {idx + 1}</div>
                    <RecursiveRequirement
                      key={idx}
                      req={req2}
                      courses={courses}
                      validCourses={validCourses}
                    />
                  </>
                ))}
              </>
            </Accordion>
          </div>
        );
      case 'Hours':
        return (
          <div className="rounded-md border border-neutral-300 p-4">
            <Accordion
              header={
                <div className="font-medium">
                  Select {req.required_hours} credit hours from the following classes
                </div>
              }
              filled={req.filled}
            >
              <>
                {req.requirements.map((req2, idx) => (
                  <>
                    <div className="h-2 px-2 text-sm">Option {idx + 1}</div>
                    <RecursiveRequirement
                      key={idx}
                      req={req2}
                      courses={courses}
                      validCourses={validCourses}
                    />
                  </>
                ))}
              </>
            </Accordion>
          </div>
        );
      case 'BA General Business Electives':
        return (
          <div className=" rounded-md border border-neutral-300 p-4">
            <Accordion
              header={
                <div className="font-medium">
                  Select {req.required_hours} credit hours from the following classes
                </div>
              }
              filled={req.filled}
            >
              <>
                {req.prefix_groups.map((req2, idx) => (
                  <RecursiveRequirement
                    key={idx}
                    req={req2}
                    courses={courses}
                    validCourses={validCourses}
                  />
                ))}
              </>
            </Accordion>
          </div>
        );
      case 'Prefix':
        return <div>Classes with {req.prefix}</div>;
      default:
        return <div>NOT SUPPORTED</div>;
    }
  };
  return <>{getRequirement()}</>;
}

function CourseRequirementComponent({
  req,
  courses,
  validCourses = {},
}: {
  req: CourseRequirement;
  courses: string[];
  validCourses: { [key: string]: number };
}) {
  const id = useMemo(() => uuidv4(), []);
  const courseQuery = trpc.courses.publicGetAllCourses.useQuery(undefined, {
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  const { data, isLoading } = courseQuery;

  let title = '';
  if (data && !isLoading) {
    const course = data.find((c) => `${c.subject_prefix} ${c.course_number}` === req.courseCode);
    title = course ? course.title : '';
  }
  console.log("REQUISITE: ", req);

  return (
    <DraggableSidebarCourseItem
      course={{
        color: '',
        courseId: req.courseId,
        id: id,
        code: req.courseCode,
        taken: courses.includes(req.courseCode),
        status: req.filled ? 'complete' : 'incomplete',
        hours: validCourses[req.courseCode],
        locked: false,
        prereqOveridden: false,
        title,
      }}
      dragId={id.toString()}
    />
  );
}
