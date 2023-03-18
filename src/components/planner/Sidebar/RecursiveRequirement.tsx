import { ObjectID } from 'bson';
import React, { useMemo } from 'react';
import DraggableSidebarCourseItem from './SidebarCourseItem';
import { CourseRequirement, RequirementTypes } from './types';
import Accordion from './Accordion';

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
          <Accordion header={<div>Select one of the following options</div>} filled={req.filled}>
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
        );
      case 'And':
        return (
          <div className="flex flex-col rounded-md border border-neutral-300 py-4">
            <Accordion header={<div>Select all of the following options</div>} filled={req.filled}>
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
      case 'Select':
        return (
          <Accordion
            header={<div>Select {req.required_count} of the following options</div>}
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
        );
      case 'Hours':
        return (
          <Accordion
            header={<div>Select {req.required_hours} credit hours from the following classes</div>}
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
        );
      case 'BA General Business Electives':
        return (
          <Accordion
            header={<div>Select {req.required_hours} credit hours from the following classes</div>}
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
  const id = useMemo(() => new ObjectID(), []);

  return (
    <DraggableSidebarCourseItem
      course={{
        color: '',
        id: id,
        code: req.course,
        taken: courses.includes(req.course),
        status: req.filled ? 'complete' : 'incomplete',
        hours: validCourses[req.course],
        locked: false,
      }}
      dragId={id.toString()}
    />
  );
}
