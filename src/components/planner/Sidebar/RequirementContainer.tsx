import {
  CSGuidedElectiveGroup,
  RequirementGroupTypes,
  RequirementTypes,
  CourseRequirement,
} from '@/pages/test';
import { ObjectID } from 'bson';
import React from 'react';
import { SemesterCourseItem } from '../Tiles/SemesterCourseItem';

import { Course, DegreeRequirement, GetDragIdByCourseAndReq } from '../types';
import AddCourseContainer from './AddCourseContainer';
import PlaceholderComponent from './PlaceholderComponent';
import RequirementContainerHeader from './RequirementContainerHeader';
import RequirementInfo from './RequirementInfo';
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
  const validCourses = degreeRequirement.validCourses ?? [];
  const numCredits = getCreditHours(validCourses);
  const description = degreeRequirement.description ?? '';

  const [selectedCourses, setSelectedCourses] = React.useState<{ [key: string]: Course }>({});

  const updateSelectedCourses = (course: Course, add: boolean) => {
    const modifySelectedCourses = { ...selectedCourses };
    add ? (modifySelectedCourses[course.code] = course) : delete modifySelectedCourses[course.code];
    setSelectedCourses(modifySelectedCourses);
  };

  const handleCourseCancel = () => {
    setSelectedCourses({});
    setAddCourse(false);
  };

  const handleCourseSubmit = () => {
    // TODO: Update DegreeRequirementsGroup here
    setSelectedCourses({});
    setAddCourse(false);
  };

  const handlePlaceholderCancel = () => {
    setPlaceholderName('');
    setPlaceholderHours(0);
    setAddPlaceholder(false);
  };

  interface PlaceholderCourse {
    name: string;
    hours: number;
    requirement: string;
  }
  const handlePlaceholderSubmit = () => {
    // Create placeholder object
    const placeholderCourse: PlaceholderCourse = {
      name: placeholderName,
      hours: placeholderHours,
      requirement: degreeRequirement.name,
    };

    // TODO: Connect this to DegreeRequirementGroup
    console.log(placeholderCourse);

    setPlaceholderName('');
    setPlaceholderHours(0);
    setAddPlaceholder(false);
  };

  const getRequirementGroup = () => {
    switch (degreeRequirement.matcher) {
      case 'And':
        return degreeRequirement.requirements.map((req, idx) => (
          <RecursiveRequirementGroup key={idx} req={req} />
        ));
      case 'FreeElectives':
        return <div>Free Elective</div>;
      case 'CS Guided Elective':
        return <CSGuidedElectiveComponent req={degreeRequirement} />;
    }
  };

  return (
    <>
      <RequirementContainerHeader
        data={degreeRequirement}
        numCredits={numCredits}
        setCarousel={setCarousel}
      />
      <div className="text-[14px]">{description}</div>

      {getRequirementGroup()}

      {/* {!addCourse && !addPlaceholder && (
        <RequirementInfo
          courses={degreeRequirement.courses}
          validCourses={validCourses}
          allUserCourses={courses}
          setAddCourse={setAddCourse}
          setAddPlaceholder={setAddPlaceholder}
          getCourseItemDragId={getCourseItemDragId}
          degreeRequirement={degreeRequirement}
        />
      )}
      )} */}
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
            <AccordianWrapper name={req.matcher}>
              {req.requirements.map((req2, idx) => (
                <RecursiveRequirementGroup key={idx} req={req2} />
              ))}
            </AccordianWrapper>
          </div>
        );
      case 'And':
        return (
          <div className="flex flex-col">
            <AccordianWrapper name={req.matcher}>
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
    <div className="collapse-arrow collapse border-2 border-pink-500" tabIndex={0}>
      <input type="checkbox" className="border-32 border-orange-500" />
      <div className="collapse-title">{name}</div>
      <div className="collapse-content">{children}</div>
    </div>
  );
}
