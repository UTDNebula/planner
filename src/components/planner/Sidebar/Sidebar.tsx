import * as Dialog from '@radix-ui/react-dialog';
import { SearchBarTwo } from '@components/credits/SearchBar';
import React, { useRef, useState } from 'react';

import RequirementsContainer from '@/components/planner/Sidebar/RequirementsContainer';

import { Course, DraggableCourse, GetDragIdByCourse } from '../types';
import DraggableCourseList from './DraggableCourseList';
import { ObjectID } from 'bson';

export interface CourseSelectorContainerProps {
  degreeRequirements: DegreeRequirements;
  courses: string[];
  getSearchedDragId: GetDragIdByCourse;
  getRequirementDragId: GetDragIdByCourse;
}
import { RouterOutputs, trpc } from '@/utils/trpc';
import { DegreeRequirements } from './types';
import ChevronIcon from '@/icons/ChevronIcon';
import useFuse from '../useFuse';
type CourseData = RouterOutputs['courses']['publicGetAllCourses'];
type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

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

  const { results, updateQuery } = useFuse<Course>({
    dataSet:
      data?.map((c) => ({ code: `${c.subject_prefix} ${c.course_number}`, title: c.title })) ?? [],

    keys: ['title', 'code'],
    threshold: 0.2,
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

  const [displayResults, setDisplay] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  return (
    <>
      {open ? (
        <div className="z-10 h-screen w-[30%] min-w-[30%] overflow-x-hidden overflow-y-scroll">
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
              <h6 className="text-base tracking-tight text-gray-500">
                Drag courses onto your plan
              </h6>
            </div>
            <div className="z-[999] drop-shadow-2xl">
              <SearchBarTwo
                onClick={() => setDisplay(true)}
                updateQuery={(q) => {
                  updateQuery(q);
                  setDisplay(true);
                }}
                className={`${
                  displayResults
                    ? 'rounded-b-none border-b-transparent'
                    : 'rounded-b-[10px] border-b-inherit'
                }`}
                placeholder="Search courses"
              />
              <div className="relative">
                <div
                  ref={ref}
                  className="absolute z-[99] w-full overflow-clip rounded-b-[10px] bg-white"
                ></div>
              </div>
            </div>

            <Dialog.Root open={displayResults} onOpenChange={(v) => setDisplay(v)} modal={false}>
              {ref.current && (
                <Dialog.Portal className="z-[99]" container={ref?.current}>
                  <Dialog.Content
                    asChild
                    className="z-[999]"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                  >
                    <div className="w-full border-[2px] border-[#EDEFF7] bg-white p-4 drop-shadow-2xl">
                      <DraggableCourseList courses={courseResults} getDragId={getSearchedDragId} />
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              )}
            </Dialog.Root>
            {degreeRequirements.requirements.length > 0 ? (
              degreeRequirements.requirements.map((req, idx) => (
                <RequirementsContainer
                  key={idx}
                  degreeRequirement={req}
                  courses={courses}
                  getCourseItemDragId={getRequirementDragId}
                />
              ))
            ) : (
              <div className="text-center text-xs font-medium leading-5 text-[#A3A3A3]">
                Our engineer team is working hard to add course progress to your major. Thanks for
                your understanding and stay tuned!
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="z-10 flex h-screen w-[50px] flex-col items-center border border-neutral-300 bg-white py-8">
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
