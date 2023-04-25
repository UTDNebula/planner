import * as Dialog from '@radix-ui/react-dialog';
import { SearchBarTwo } from '@components/credits/SearchBar';
import React, { useRef, useState } from 'react';

import RequirementsContainer from '@/components/planner/Sidebar/RequirementsContainer';
import { getSemesterHourFromCourseCode } from '@/utils/utilFunctions';

import { Course, DraggableCourse, GetDragIdByCourse } from '../types';
import DraggableCourseList from './DraggableCourseList';
import { ObjectID } from 'bson';

export interface CourseSelectorContainerProps {
  degreeRequirements: DegreeRequirements;
  courses: string[];
  transferCredits: string[];
  getSearchedDragId: GetDragIdByCourse;
  getRequirementDragId: GetDragIdByCourse;
}
import { RouterOutputs, trpc } from '@/utils/trpc';
import { DegreeRequirements } from './types';
import ChevronIcon from '@/icons/ChevronIcon';
import useFuse from '../useFuse';
import AnalyticsWrapper from '@/components/common/AnalyticsWrapper';
type CourseData = RouterOutputs['courses']['publicGetAllCourses'];
type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

function CourseSelectorContainer({
  degreeRequirements,
  courses,
  transferCredits,
  getSearchedDragId,
  getRequirementDragId,
}: CourseSelectorContainerProps) {
  // TODO: Provide UI indicator for errors

  const { data, isLoading } = trpc.courses.publicGetAllCourses.useQuery();

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

  let sum = 0;
  courses.forEach((string) => {
    sum += getSemesterHourFromCourseCode(string) ?? 3;
  });
  transferCredits.forEach((credit) => {
    sum += getSemesterHourFromCourseCode(credit) ?? 3;
  });

  const CreditsTaken = ({
    taken,
    min,
    unit = 'Credits Taken',
  }: {
    taken: number;
    min: number;
    unit?: string;
  }) => {
    return (
      <div
        className={`ml-[20px] mt-2 flex w-fit items-center gap-x-3 rounded-full ${
          taken >= min ? 'bg-primary-100' : 'bg-yellow-100'
        } px-3 py-2`}
      >
        <span
          className={`whitespace-nowrap font-semibold sm:text-[10px] lg:text-xs ${
            taken >= min ? 'text-primary-800' : 'text-yellow-500'
          }`}
        >
          {taken}/{min} {unit}
        </span>
      </div>
    );
  };

  const [open, setOpen] = useState(true);

  const [displayResults, setDisplay] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  return (
    <>
      {open ? (
        <div
          id="tutorial-editor-1"
          className="z-0 h-screen w-[30%] min-w-[30%] overflow-x-hidden overflow-y-scroll"
        >
          <div className="flex h-fit min-h-screen w-full flex-col gap-y-4 bg-white p-4">
            <div className="flex flex-col">
              <div className="flex flex-col justify-between xl:flex-row xl:items-center">
                <div className="flex flex-row items-center xl:justify-center">
                  <ChevronIcon
                    onClick={() => setOpen(!open)}
                    className={`h-4 w-4 cursor-pointer ${open ? '' : 'rotate-180'}`}
                    strokeWidth={2.5}
                  />
                  <h1 className="whitespace-nowrap pl-2 text-2xl font-medium tracking-tight">
                    Plan Requirements
                  </h1>
                </div>
                <div id="tutorial-editor-2">
                  <CreditsTaken
                    taken={sum}
                    min={
                      degreeRequirements.requirements.length > 0
                        ? degreeRequirements.requirements[1].min_hours
                        : 120
                    }
                  />
                </div>
              </div>
              <h6 className="text-base tracking-tight text-gray-500">
                Drag courses onto your plan
              </h6>
            </div>
            <div className="z-[999] drop-shadow-2xl">
              <AnalyticsWrapper analyticsClass="umami--click--search-course">
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
              </AnalyticsWrapper>
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
                    {!isLoading ? (
                      <div className="w-full border-[2px] border-[#EDEFF7] bg-white p-4 drop-shadow-2xl">
                        <DraggableCourseList
                          courses={courseResults}
                          getDragId={getSearchedDragId}
                        />
                      </div>
                    ) : (
                      <div className="p-4 text-base text-[#757575]">
                        Please wait, courses are loading....
                      </div>
                    )}
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
              <div className="flex h-[30vh] flex-grow text-base leading-5 text-[#A3A3A3]">
                <div className="mx-12 mt-44 items-center justify-center text-center leading-6">
                  Our engineer team is working hard to add course progress to your major. Thanks for
                  your understanding and stay tuned!
                </div>
              </div>
            )}
            <div className="flex flex-grow items-end justify-end text-sm ">
              <div>
                <span className="font-bold">Warning:</span> This is an unofficial tool not
                affiliated with the university. For official advice, please consult the course
                catalog and confirm with your department advisors. <br /> <br />
                Problems with degree or prerequisite validation? Request edits here or send an email
                to planner@utdnebula.com.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="z-0 flex h-screen w-[50px] flex-col items-center border border-neutral-300 bg-white py-8">
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
