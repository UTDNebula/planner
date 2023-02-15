import useSearch from '@/components/search/search';
import {
  CSGuidedElectiveGroup,
  RequirementGroupTypes,
  RequirementTypes,
  CourseRequirement,
} from '@/pages/test';
import { trpc } from '@/utils/trpc';
import { ObjectID } from 'bson';
import { filter } from 'cypress/types/bluebird';
import React from 'react';

import { Course, DegreeRequirement, GetDragIdByCourseAndReq } from '../types';
import RequirementContainerHeader from './RequirementContainerHeader';
import RequirementInfo from './RequirementInfo';
import RequirementSearchBar from './RequirementSearchBar';
import DraggableSidebarCourseItem from './SidebarCourseItem';

export interface RequirementContainerProps {
  degreeRequirement: RequirementGroupTypes;
  courses: string[];
  setCarousel: (state: boolean) => void;
  getCourseItemDragId: GetDragIdByCourseAndReq;
}

function RequirementContainer({
  degreeRequirement,
  setCarousel,
}: RequirementContainerProps): JSX.Element {
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
        case 'course':
          return elm.course.toLowerCase().includes(query);
        case 'Or':
          return elm.metadata ? elm.metadata.name.toLowerCase().includes(query) : true;
        case 'And':
          return elm.metadata ? elm.metadata.name.toLowerCase().includes(query) : true;
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
                  matcher: 'course',
                  filled: false,
                  metadata: {},
                }))
              : [],
          filterFunction: filterFunc,
        };
      case 'CS Guided Elective':
        return {
          name: degreeRequirement.metadata.name,
          status: `${degreeRequirement.fulfilled_count} / ${degreeRequirement.required_count} courses`,
          description: degreeRequirement.metadata.description ?? '',
          getData: async () =>
            q.data
              ? (q.data
                  .map((c) => ({
                    course: `${c.subject_prefix} ${c.course_number}`,
                    matcher: 'course',
                  }))
                  .filter((c) => c.course.includes('CS 43')) as CourseRequirement[])
              : [],
          filterFunction: filterFunc,
        };
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
          return <RecursiveRequirementGroup key={idx} req={req} />;
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
function RecursiveRequirementGroup({ req }: { req: RequirementTypes }) {
  const getRequirement = () => {
    switch (req.matcher) {
      case 'course':
        return <CourseRequirement req={req} />;
      case 'Or':
        return (
          <div className="flex flex-col">
            <AccordianWrapper name={`Select one of the following:`}>
              {req.requirements.map((req2, idx) => (
                <RecursiveRequirementGroup key={idx} req={req2} />
              ))}
            </AccordianWrapper>
          </div>
        );
      case 'And':
        return (
          <div className="flex flex-col">
            <AccordianWrapper name={`Select all of the following`}>
              {req.requirements.map((req2, idx) => (
                <RecursiveRequirementGroup key={idx} req={req2} />
              ))}
            </AccordianWrapper>
          </div>
        );
      default:
        return <div>NOT SUPPORTED</div>;
    }
  };
  return <>{getRequirement()}</>;
}

function bRequirement({ req }: { req: CourseRequirement }) {
  const id = new ObjectID();
  return (
    <DraggableSidebarCourseItem course={{ id: id, code: req.course }} dragId={id.toString()} />
  );
}

const CourseRequirement = React.memo(bRequirement);

/**
 * TODO: Make this custom because it's causing annoying behaviors
 * TODO: Add progress here
 * @param param0
 * @returns
 */
function AccordianWrapper({ name, children }: { name: string; children: any }) {
  return (
    <div className="collapse-arrow collapse" tabIndex={0}>
      <input type="checkbox" className="border-32 border-orange-500" />
      <div className="collapse-title">{name}</div>
      <div className="collapse-content">{children}</div>
    </div>
  );
}
