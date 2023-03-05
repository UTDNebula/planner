import { SearchBarTwo } from '@components/credits/SearchBar';
import React, { useState } from 'react';

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
import ChevronIcon from '@/icons/ChevronIcon';

export enum SearchType {
  TITLE,
  CODE,
}

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

  const { data, isLoading } = q;
  const [searchType, setSearchType] = useState<SearchType>(SearchType.CODE);
  const filterFn = React.useCallback(
    (elm: { code: string; title: string }, query: string) => {
      return (searchType === SearchType.CODE ? elm['code'] : elm['title'])
        .toLowerCase()
        .includes(query.toLowerCase());
    },
    [searchType],
  );

  const { results, updateQuery } = useSearch({
    getData: async () =>
      data
        ? data.map((c) => ({ code: `${c.subject_prefix} ${c.course_number}`, title: c.title }))
        : [],
    initialQuery: '@',
    filterFn: (elm, query) => filterFn(elm, query),
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

  const [open, setOpen] = useState(true);

  const handleSearchTypeChange = () => {
    if (searchType === SearchType.CODE) {
      setSearchType(SearchType.TITLE);
    } else {
      setSearchType(SearchType.CODE);
    }
  };

  return (
    <>
      {open ? (
        <div className="h-screen w-[30%] overflow-x-hidden overflow-y-scroll">
          <div className="flex h-fit min-h-full w-full flex-col gap-y-4 bg-white p-4">
            <div className="flex flex-col">
              <div className="flex flex-row items-center">
                <ChevronIcon
                  onClick={() => setOpen(!open)}
                  className={`h-4 w-4 cursor-pointer ${open ? '' : 'rotate-180'}`}
                  strokeWidth={2.5}
                />
                <h1 className="pl-2 text-2xl font-medium tracking-tight">Plan Requirements</h1>
              </div>
              <h6 className="text-sm tracking-tight text-gray-400">Drag courses onto your plan</h6>
              <div className="form-control">
                <label className="label cursor-pointer justify-center gap-3">
                  <span className="label-text">Course Code</span>
                  <input
                    type="checkbox"
                    className="toggle"
                    onChange={() => handleSearchTypeChange()}
                  />
                  <span className="label-text">Course Title</span>
                </label>
              </div>
            </div>
            <SearchBarTwo
              updateQuery={updateQuery}
              placeholder="Search courses"
              searchType={searchType}
            />

            <div className="bg-white p-4">
              {results.length > 0 && (
                <DraggableCourseList courses={courseResults} getDragId={getSearchedDragId} />
              )}
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
      ) : (
        <div className="flex h-screen w-[50px] flex-col items-center border border-neutral-300 bg-white py-8">
          <ChevronIcon
            onClick={() => setOpen(!open)}
            className={`h-4 w-4 cursor-pointer ${!open ? 'rotate-180' : ''}`}
            strokeWidth={2.5}
          />
        </div>
      )}
    </>
  );
}

export default React.memo(CourseSelectorContainer);
