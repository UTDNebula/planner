import { Course } from '@/modules/common/data';
import React from 'react';
import { DegreeRequirement, GetDragIdByCourseAndReq } from '../types';
import RequirementContainerHeader from './RequirementContainerHeader';
import AddCourseContainer from './AddCourseContainer';
import PlaceholderComponent from './PlaceholderComponent';
import RequirementInfo from './RequirementInfo';

export interface RequirementContainerProps {
  degreeRequirement: DegreeRequirement;
  setCarousel: (state: boolean) => void;
  getCourseItemDragId: GetDragIdByCourseAndReq;
}

export default function RequirementContainer({
  degreeRequirement,
  setCarousel,
  getCourseItemDragId,
}: RequirementContainerProps): JSX.Element {
  const [addCourse, setAddCourse] = React.useState<boolean>(false);
  const [addPlaceholder, setAddPlaceholder] = React.useState<boolean>(false);
  const [placeholderName, setPlaceholderName] = React.useState<string>('');
  const [placeholderHours, setPlaceholderHours] = React.useState<number>(0);

  // TODO: Move to utils file
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

  const sumList = (values: number[]): number => {
    return values.reduce((prev: number, curr: number) => prev + curr);
  };

  // Include tag rendering information here (yes for tag & which tag)
  // TODO: Obviously have a better way of computing all courses user has taken
  // Idea is allCourses will be available as context or props or smthn
  const allCourses: Set<string> = new Set();

  // Get all courses user has taken
  degreeRequirement.validCourses.forEach((course) => {
    allCourses.add(course);
  });

  const numCredits = getCreditHours(degreeRequirement.validCourses);
  const description = degreeRequirement.description ?? '';

  const [selectedCourses, setSelectedCourses] = React.useState<{ [key: string]: Course }>({});

  const updateSelectedCourses = (course: Course, add: boolean) => {
    const modifySelectedCourses = { ...selectedCourses };
    add
      ? (modifySelectedCourses[course.catalogCode] = course)
      : delete modifySelectedCourses[course.catalogCode];
    setSelectedCourses(modifySelectedCourses);
  };

  const handleCourseCancel = () => {
    setSelectedCourses({});
    setAddCourse(false);
  };

  const handleCourseSubmit = () => {
    // TODO: Update DegreeRequirementsGroup here
    console.log(selectedCourses);
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
  return (
    <>
      <RequirementContainerHeader
        data={degreeRequirement}
        numCredits={numCredits}
        setCarousel={setCarousel}
      />
      <div className="text-[11px]">{description}</div>

      {!addCourse && !addPlaceholder && (
        <RequirementInfo
          courses={degreeRequirement.courses}
          allUserCourses={allCourses}
          setAddCourse={setAddCourse}
          setAddPlaceholder={setAddPlaceholder}
          getCourseItemDragId={getCourseItemDragId}
          degreeRequirement={degreeRequirement}
        />
      )}
      {addCourse && (
        <AddCourseContainer
          allCourses={allCourses}
          selectedCourses={selectedCourses}
          updateSelectedCourses={updateSelectedCourses}
          handleCourseCancel={handleCourseCancel}
          handleCourseSubmit={handleCourseSubmit}
        />
      )}
      {addPlaceholder && (
        <PlaceholderComponent
          placeholderName={placeholderName}
          placeholderHours={placeholderHours}
          setPlaceholderName={setPlaceholderName}
          setPlaceholderHours={setPlaceholderHours}
          handlePlaceholderCancel={handlePlaceholderCancel}
          handlePlaceholderSubmit={handlePlaceholderSubmit}
        />
      )}
    </>
  );
}
