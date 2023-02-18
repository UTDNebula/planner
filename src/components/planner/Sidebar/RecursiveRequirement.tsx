import { ObjectID } from 'bson';
import React from 'react';
import DraggableSidebarCourseItem from './SidebarCourseItem';
import { CourseRequirement, RequirementTypes } from './types';
import CheckIcon from '@mui/icons-material/Check';

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
      // return {
      //   name: degreeRequirement.metadata.name,
      //   status: `${degreeRequirement.fulfilled_count} / ${degreeRequirement.required_count} courses \n ${degreeRequirement.fulfilled_hours} / ${degreeRequirement.required_hours} hours`,
      //   description: degreeRequirement.metadata.description ?? '',
      //   getData: () => Promise.resolve(degreeRequirement.prefix_groups),
      //   filterFunction: filterFunc,
      // };
      case 'Prefix':
        return <div>Classes with {req.prefix}</div>;
      default:
        console.log(req);
        console.log('R');
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

/**
 * TODO: Make this custom because it's causing annoying behaviors
 * TODO: Add progress here
 * @param param0
 * @returns
 */
function AccordianWrapper({
  name,
  filled,
  children,
}: {
  name: string;
  filled?: boolean;
  children: any;
}) {
  return (
    <div className={`collapse-arrow collapse ${filled && 'opacity-50'}`} tabIndex={0}>
      <input type="checkbox" className="border-32 border-orange-500" />
      <div className="collapse-title flex flex-row items-center">
        {name} {filled && <CheckIcon fontSize="small" />}
      </div>
      <div className="collapse-content">{children}</div>
    </div>
  );
}
