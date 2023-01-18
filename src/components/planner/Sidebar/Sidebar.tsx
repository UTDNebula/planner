import SearchBar from '@components/credits/SearchBar';

import RequirementsContainer from '@/components/planner/Sidebar/RequirementsContainer';
import useSearch from '@/components/search/search';

import { DegreeRequirementGroup, DraggableCourse, GetDragIdByCourse } from '../types';
import DraggableCourseList from './DraggableCourseList';
import React from 'react';
import { loadDummyCourses } from '@/utils/utilFunctions';

export interface CourseSelectorContainerProps {
  degreeRequirements: DegreeRequirementGroup[];
  getSearchedDragId: GetDragIdByCourse;
  getRequirementDragId: GetDragIdByCourse;
}

function CourseSelectorContainer({
  degreeRequirements,
  getSearchedDragId,
  getRequirementDragId,
}: CourseSelectorContainerProps) {
  console.log('RERENDER');
  console.log(degreeRequirements);
  // TODO: Provide UI indicator for errors
  const { results, updateQuery } = useSearch({
    getData: loadDummyCourses,
    initialQuery: '@',
    filterFn: (elm, query) => elm['code'].toLowerCase().includes(query.toLowerCase()),
    constraints: [0, 5],
  });

  // TODO: Change later!!! This code hides search bar when no input
  const updateQueryWrapper = (query: string) => {
    if (query === '') {
      query = '@';
    }
    updateQuery(query);
  };

  // Include tag rendering information here (yes for tag & which tag)
  // TODO: Obviously have a better way of computing all courses user has taken
  // Idea is allCourses will be available as context or props or smthn
  const allCourses: Set<string> = new Set();

  // TODO: Prolly have a context for this
  // Get all courses user has taken
  degreeRequirements.forEach((reqGroup) => {
    reqGroup.requirements.forEach((req) => {
      req.validCourses.forEach((course) => {
        allCourses.add(course);
      });
    });
  });

  const courseResults = results.map((result) => {
    return { ...result, status: allCourses.has(result.code) ? 'complete' : undefined };
  }) as DraggableCourse[];

  return (
    <div className="grid grid-rows-[auto_1fr] gap-y-8 w-[344px] h-full overflow-hidden">
      <SearchBar updateQuery={updateQueryWrapper} placeholder="Search courses" />
      <div className="overflow-y-scroll max-h-full overflow-x-hidden">
        {results.length > 0 && (
          <div className="bg-white p-4">
            <DraggableCourseList courses={courseResults} getDragId={getSearchedDragId} />
          </div>
        )}
        {degreeRequirements.map((req, idx) => (
          <RequirementsContainer
            key={idx}
            degreeRequirement={req}
            getCourseItemDragId={getRequirementDragId}
          />
        ))}
      </div>
    </div>
  );
}

export default React.memo(CourseSelectorContainer);
