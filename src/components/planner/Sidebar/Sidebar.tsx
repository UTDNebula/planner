import SearchBar from '@components/credits/SearchBar';
import React from 'react';

import RequirementsContainer from '@/components/planner/Sidebar/RequirementsContainer';
import useSearch from '@/components/search/search';

import { DegreeRequirementGroup, PlanCourse, GetDragIdByCourse } from '../types';
import DraggableCourseList from './DraggableCourseList';
import { ObjectID } from 'bson';

export interface CourseSelectorContainerProps {
  degreeRequirements: DegreeRequirementGroup[];
  courses: string[];
  getSearchedDragId: GetDragIdByCourse;
  getRequirementDragId: GetDragIdByCourse;
}
import { trpc } from '@/utils/trpc';
import lang from 'lodash-es/lang';
import object from 'lodash-es/object';

function CourseSelectorContainer({
  degreeRequirements,
  courses,
  getSearchedDragId,
  getRequirementDragId,
}: CourseSelectorContainerProps) {
  // TODO: Provide UI indicator for errors
  const q = trpc.courses.publicGetAllCourses.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const defaultQuery = 'CS';

  const { data, isLoading } = q;

  // Hacky
  React.useEffect(() => {
    updateQuery(defaultQuery);
  }, [isLoading]);

  const { results, updateQuery } = useSearch({
    getData: async () =>
      data ? data.map((c) => ({ code: `${c.subject_prefix} ${c.course_number}` })) : [],
    initialQuery: defaultQuery,
    filterFn: (elm, query) => elm['code'].toLowerCase().includes(query.toLowerCase()),
    constraints: [0, 5],
  });

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
    }) as PlanCourse[];
  }, [results, courses]);

  return (
    <div className="flex h-full w-[344px] flex-col gap-y-8 overflow-hidden">
      <SearchBar updateQuery={updateQuery} placeholder="Search courses" />

      {results.length > 0 && (
        <div className="bg-white p-4">
          <DraggableCourseList courses={courseResults} getDragId={getSearchedDragId} />
        </div>
      )}
      {degreeRequirements.map((req, idx) => (
        <RequirementsContainer
          key={idx}
          degreeRequirement={req}
          courses={courses}
          getCourseItemDragId={getRequirementDragId}
        />
      ))}
    </div>
  );
}

export default React.memo(CourseSelectorContainer, (oldProps, newProps) => {
  return lang.isEqual(
    object.omit(oldProps, object.functions(oldProps)),
    object.omit(newProps, object.functions(newProps)),
  );
});
