import React from 'react';

import { Course, DegreeRequirement, GetDragIdByCourseAndReq } from '../types';
import PlaceholderComponent from './PlaceholderComponent';
import RequirementContainerHeader from './RequirementContainerHeader';
import RequirementInfo from './RequirementInfo';

export interface RequirementContainerProps {
  degreeRequirement: DegreeRequirement;
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
    setAddPlaceholder(false);
  };

  interface PlaceholderCourse {
    name: string;
    hours: number;
    requirement: string;
  }
  const handlePlaceholderSubmit = () => {
    setAddPlaceholder(false);
  };
  return (
    <>
      <RequirementContainerHeader
        data={degreeRequirement}
        numCredits={numCredits}
        setCarousel={setCarousel}
      />
      <div className="text-[14px]">{description}</div>

      {!addCourse && !addPlaceholder && (
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
      {addPlaceholder && (
        <PlaceholderComponent
          requirement={degreeRequirement.name}
          handlePlaceholderCancel={handlePlaceholderCancel}
          handlePlaceholderSubmit={handlePlaceholderSubmit}
        />
      )}
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
