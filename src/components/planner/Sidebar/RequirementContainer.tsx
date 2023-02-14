import {
  CSGuidedElectiveGroup,
  RequirementGroupTypes,
  RequirementTypes,
  CourseRequirement,
} from '@/pages/test';
import { ObjectID } from 'bson';
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
  courses,
  setCarousel,
  getCourseItemDragId,
}: RequirementContainerProps): JSX.Element {
  const [addCourse, setAddCourse] = React.useState<boolean>(false);
  const [addPlaceholder, setAddPlaceholder] = React.useState<boolean>(false);
  const [placeholderName, setPlaceholderName] = React.useState<string>('');
  const [placeholderHours, setPlaceholderHours] = React.useState<number>(0);

  // Include tag rendering information here (yes for tag & which tag)

  const [selectedCourses, setSelectedCourses] = React.useState<{ [key: string]: Course }>({});

  const getRequirementGroup = (): {
    name: string;
    status: string;
    description: string;
    body: JSX.Element | JSX.Element[];
  } => {
    switch (degreeRequirement.matcher) {
      case 'And':
        return {
          name: degreeRequirement.metadata.name,
          status: 'hi',
          description: 'not fulfilled',
          body: degreeRequirement.requirements.map((req, idx) => (
            <RecursiveRequirementGroup key={idx} req={req} />
          )),
        };
      case 'FreeElectives':
        return {
          name: degreeRequirement.metadata.name,
          status: 'hi',
          description: 'not fulfilled',
          body: <div>Free Elective</div>,
        };
      case 'CS Guided Elective':
        return {
          name: degreeRequirement.metadata.name,
          status: 'hi',
          description: 'not fulfilled',
          body: <CSGuidedElectiveComponent req={degreeRequirement} />,
        };
    }
  };

  const { name, status, description, body } = getRequirementGroup();

  return (
    <>
      <RequirementContainerHeader name={name} status={status} setCarousel={setCarousel} />
      <div className="text-[14px]">{description}</div>
      <div className="relative h-[300px] overflow-x-hidden overflow-y-scroll">
        <RequirementSearchBar updateQuery={() => console.log('HI')} />
        {body}
      </div>
      <button onClick={() => setAddPlaceholder(true)}>+ ADD PLACEHOLDER</button>
    </>
  );
}

export default React.memo(RequirementContainer);

const sumList = (values: number[]): number => {
  return values.reduce((prev: number, curr: number) => prev + curr);
};

const getCreditHours = (validCourses: string[]): number => {
  return validCourses.length > 0
    ? sumList(
        Object.values(
          validCourses.map((elm) => {
            return parseInt(elm.split(' ')[1].substring(1, 2));
          }),
        ),
      )
    : 0;
};

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

function CSGuidedElectiveComponent({ req }: { req: CSGuidedElectiveGroup }) {
  return (
    <div>
      Completed Courses:
      {req.valid_courses.map((course, idx) => (
        <div key={idx}>{course}</div>
      ))}
      Select Courses:
      {req.also_fulfills.map((course, idx) => (
        <CourseRequirement key={idx} req={course} />
      ))}
    </div>
  );
}

/**
 * TODO: Make this custom because it's causing annoying behaviors
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
