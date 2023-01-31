import SearchBar from '@components/credits/SearchBar';
import React from 'react';

import RequirementsContainer from '@/components/planner/Sidebar/RequirementsContainer';
import useSearch from '@/components/search/search';
import { loadDummyCourses } from '@/utils/utilFunctions';

import { DegreeRequirementGroup, DraggableCourse, GetDragIdByCourse } from '../types';
import DraggableCourseList from './DraggableCourseList';
import { ObjectID } from 'bson';

export interface CourseSelectorContainerProps {
  degreeRequirements: DegreeRequirementGroup[];
  courses: string[];
  getSearchedDragId: GetDragIdByCourse;
  getRequirementDragId: GetDragIdByCourse;
}

function CourseSelectorContainer({
  degreeRequirements,
  courses,
  getSearchedDragId,
  getRequirementDragId,
}: CourseSelectorContainerProps) {
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

  // TODO: Prolly have a context for this
  // Get all courses user has taken

  const courseResults = React.useMemo(() => {
    return results.map((result) => {
      return {
        ...result,
        id: new ObjectID(),
        status: courses.includes(result.code) ? 'complete' : undefined,
      };
    }) as DraggableCourse[];
  }, [results, courses]);

  return (
    <div className="flex flex-col gap-y-8 w-[344px] h-full overflow-hidden">
      <SearchBar updateQuery={updateQueryWrapper} placeholder="Search courses" />

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
  );
}

export default React.memo(CourseSelectorContainer);
