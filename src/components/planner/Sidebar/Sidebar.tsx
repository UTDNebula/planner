import { SearchBarTwo } from '@components/credits/SearchBar';
import React from 'react';

import RequirementsContainer from '@/components/planner/Sidebar/RequirementsContainer';
import useSearch from '@/components/search/search';

import { DraggableCourse, GetDragIdByCourse } from '../types';
import DraggableCourseList from './DraggableCourseList';
import { ObjectID } from 'bson';

export interface CourseSelectorContainerProps {
  degreeRequirements: DegreeRequirements;
  courses: string[];
  getSearchedDragId: GetDragIdByCourse;
  getRequirementDragId: GetDragIdByCourse;
}
import { trpc } from '@/utils/trpc';
import { DegreeRequirements } from './types';

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
    <div className="h-screen min-w-[25%] w-[35%] resize-x overflow-scroll">
      <div className="flex h-fit min-h-full w-full flex-col gap-y-8 bg-white p-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-medium">Plan Requirements</h1>
          <h6 className="text-xl font-medium text-gray-400">Drag courses onto your plan</h6>
        </div>
        <SearchBarTwo updateQuery={updateQuery} placeholder="Search courses" />

        <div className="bg-white p-4">
          <DraggableCourseList courses={courseResults} getDragId={getSearchedDragId} />
        </div>

        {degreeRequirements.requirements.map((req, idx) => (
          <RequirementsContainer
            key={idx}
            degreeRequirement={req}
            courses={courses}
            getCourseItemDragId={getRequirementDragId}
          />
        ))}
      </div>
    </div>
  );
}

export default React.memo(CourseSelectorContainer);
