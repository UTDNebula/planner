import useSearch from '@/components/search/search';
import { RequirementGroupTypes, RequirementTypes, CourseRequirement } from '@/pages/test';
import { trpc } from '@/utils/trpc';
import { ObjectID } from 'bson';
import React from 'react';

import { GetDragIdByCourseAndReq } from '../types';
import RequirementContainerHeader from './RequirementContainerHeader';
import RequirementSearchBar from './RequirementSearchBar';
import DraggableSidebarCourseItem from './SidebarCourseItem';

import CheckIcon from '@mui/icons-material/Check';
import { getSemesterHourFromCourseCode } from '@/utils/utilFunctions';
export interface RequirementContainerProps {
  degreeRequirement: RequirementGroupTypes;
  courses: string[];
  setCarousel: (state: boolean) => void;
  getCourseItemDragId: GetDragIdByCourseAndReq;
}

function RequirementContainer({
  degreeRequirement,
  setCarousel,
  courses,
}: RequirementContainerProps): JSX.Element {
  // Handles logic for displaying correct requirement group
  const getRequirementGroup = (): {
    name: string;
    status: string;
    description: string;
    getData: () => Promise<RequirementTypes[]>;
    filterFunction: (elm: RequirementTypes, query: string) => boolean;
  } => {
    const q = trpc.courses.publicGetAllCourses.useQuery(undefined, {
      refetchOnWindowFocus: false,
    });

    const filterFunc = (elm: RequirementTypes, query: string) => {
      query = query.toLowerCase();
      switch (elm.matcher) {
        case 'Course':
          return elm.course.toLowerCase().includes(query);
        case 'Or':
          return elm.metadata ? elm.metadata.name.toLowerCase().includes(query) : true;
        case 'And':
          return elm.metadata ? elm.metadata.name.toLowerCase().includes(query) : true;
        case 'Select':
          return elm.metadata ? elm.metadata.name.toLowerCase().includes(query) : true;
        default:
          return true;
      }
    };

    switch (degreeRequirement.matcher) {
      case 'And':
        return {
          name: degreeRequirement.metadata.name,
          status: `${degreeRequirement.num_fulfilled_requirements} / ${degreeRequirement.num_requirements} requirements`,
          description: degreeRequirement.metadata.description ?? '',
          getData: () => Promise.resolve(degreeRequirement.requirements),
          filterFunction: filterFunc,
        };
      case 'Hours':
        return {
          name: degreeRequirement.metadata.name,
          status: `${degreeRequirement.fulfilled_hours} / ${degreeRequirement.required_hours} hours`,
          description: degreeRequirement.metadata.description ?? '',
          getData: () => Promise.resolve(degreeRequirement.requirements),
          filterFunction: filterFunc,
        };
      case 'FreeElectives':
        // Some function to get courses
        return {
          name: degreeRequirement.metadata.name,
          status: `${degreeRequirement.fulfilled_hours} / ${degreeRequirement.required_hours} hours`,
          description: degreeRequirement.metadata.description ?? '',
          getData: async () =>
            q.data
              ? q.data.map((c) => ({
                  course: `${c.subject_prefix} ${c.course_number}`,
                  matcher: 'Course',
                  filled: false,
                  metadata: {},
                }))
              : [],
          filterFunction: filterFunc,
        };
      case 'CS Guided Electives':
        return {
          name: degreeRequirement.metadata.name,
          status: `${degreeRequirement.fulfilled_count} / ${degreeRequirement.required_count} courses`,
          description: degreeRequirement.metadata.description ?? '',
          getData: async () =>
            q.data
              ? (q.data
                  .map((c) => ({
                    course: `${c.subject_prefix} ${c.course_number}`,
                    matcher: 'Course',
                  }))
                  .filter((c) => c.course.includes('CS 43')) as CourseRequirement[])
              : [],
          filterFunction: filterFunc,
        };

      default: {
        return {
          name: '',
          status: 'NOT SUPPORTED',
          description: '',
          getData: () => Promise.resolve([] as RequirementTypes[]),
          filterFunction: (_, __) => true,
        };
      }
    }
  };

  const { name, status, description, getData, filterFunction } = getRequirementGroup();

  const { results, updateQuery } = useSearch({
    getData: getData,
    initialQuery: 'C',
    filterFn: filterFunction,
  });

  React.useEffect(() => {
    updateQuery('');
  }, [degreeRequirement]);

  return (
    <>
      <RequirementContainerHeader name={name} status={status} setCarousel={setCarousel} />
      <div className="text-[14px]">{description}</div>
      <div className=" h-[300px] overflow-x-hidden overflow-y-scroll">
        <RequirementSearchBar updateQuery={updateQuery} />
        {results.map((req, idx) => {
          return (
            <RecursiveRequirementGroup
              key={idx}
              req={req}
              courses={courses}
              validCourses={
                degreeRequirement.matcher === 'Hours' ? degreeRequirement.valid_courses : {}
              }
            />
          );
        })}
      </div>
      {/* <button onClick={() => setAddPlaceholder(true)}>+ ADD PLACEHOLDER</button> */}
    </>
  );
}

export default React.memo(RequirementContainer);

/**
 * Group of requirements that's recursive?
 * @param param0
 * @returns
 */
function RecursiveRequirementGroup({
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
        return <CourseRequirement req={req} courses={courses} validCourses={validCourses} />;
      case 'Or':
        return (
          <div className="flex flex-col">
            <AccordianWrapper name={`Select one of the following:`} {...req} filled={req.filled}>
              {req.requirements.map((req2, idx) => (
                <RecursiveRequirementGroup
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
                <RecursiveRequirementGroup
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
                <RecursiveRequirementGroup
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
                <RecursiveRequirementGroup
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
                <RecursiveRequirementGroup
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

function bRequirement({
  req,
  courses,
  validCourses = {},
}: {
  req: CourseRequirement;
  courses: string[];
  validCourses: { [key: string]: number };
}) {
  const id = new ObjectID();
  console.log(validCourses);
  console.log(req.course);
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

const CourseRequirement = React.memo(bRequirement);

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
