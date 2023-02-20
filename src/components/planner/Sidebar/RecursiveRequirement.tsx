import { ObjectID } from 'bson';
import React from 'react';
import DraggableSidebarCourseItem from './SidebarCourseItem';
import { CourseRequirement, RequirementTypes } from './types';
import { AccordianWrapper } from './Accordion';

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
          <div className="flex flex-col">
            <AccordianWrapper name={`Select one of the following:`} {...req} filled={req.filled}>
              {req.requirements.map((req2, idx) => (
                <RecursiveRequirement
                  key={idx}
                  req={req2}
                  courses={courses}
                  validCourses={validCourses}
                />
              ))}
            </AccordianWrapper>
          </div>
        );
      case 'And':
        return (
          <div className="flex flex-col">
            <AccordianWrapper name={`Select all of the following`} filled={req.filled}>
              {req.requirements.map((req2, idx) => (
                <RecursiveRequirement
                  key={idx}
                  req={req2}
                  courses={courses}
                  validCourses={validCourses}
                />
              ))}
            </AccordianWrapper>
          </div>
        );
      case 'Select':
        return (
          <div className="flex flex-col">
            <AccordianWrapper
              name={`Select ${req.required_course_count} of the following`}
              filled={req.filled}
            >
              {req.requirements.map((req2, idx) => (
                <RecursiveRequirement
                  key={idx}
                  req={req2}
                  courses={courses}
                  validCourses={validCourses}
                />
              ))}
            </AccordianWrapper>
          </div>
        );
      case 'Hours':
        return (
          <div className="flex flex-col">
            <AccordianWrapper
              name={`Select ${req.required_hours} credit hours from the following classes`}
              filled={req.filled}
            >
              {req.requirements.map((req2, idx) => (
                <RecursiveRequirement
                  key={idx}
                  req={req2}
                  courses={courses}
                  validCourses={req.valid_courses}
                />
              ))}
            </AccordianWrapper>
          </div>
        );
      case 'BA General Business Electives':
        return (
          <div className="flex flex-col">
            <AccordianWrapper
              name={`Select ${req.required_hours} credit hours from the following classes`}
              filled={req.filled}
            >
              {req.prefix_groups.map((req2, idx) => (
                <RecursiveRequirement
                  key={idx}
                  req={req2}
                  courses={courses}
                  validCourses={validCourses}
                />
              ))}
            </AccordianWrapper>
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
  const id = new ObjectID();
  return (
    <DraggableSidebarCourseItem
      course={{
        id: id,
        code: req.course,
        taken: courses.includes(req.course),
        status: req.filled ? 'complete' : 'incomplete',
        hours: validCourses[req.course],
      }}
      dragId={id.toString()}
    />
  );
}
