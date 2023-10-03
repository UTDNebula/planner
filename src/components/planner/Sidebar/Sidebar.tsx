import * as Dialog from '@radix-ui/react-dialog';
import { useRef, useState, useMemo, memo } from 'react';
import Skeleton from 'react-loading-skeleton';
import { v4 as uuidv4 } from 'uuid';

import AccordionSkeleton from './AccordionSkeleton';
import DraggableCourseList from './DraggableCourseList';
import { DegreeRequirement } from './types';
import { Course, DraggableCourse, GetDragIdByCourse } from '../types';
import useFuse from '../useFuse';

import Button from '@/components/Button';
import AnalyticsWrapper from '@/components/common/AnalyticsWrapper';
import RequirementsContainer from '@/components/planner/Sidebar/RequirementsContainer';
import SearchBar from '@/components/planner/Sidebar/SearchBar';
import ChevronIcon from '@/icons/ChevronIcon';
import { trpc } from '@/utils/trpc';
import { getSemesterHourFromCourseCode } from '@/utils/utilFunctions';

import 'react-loading-skeleton/dist/skeleton.css';

export interface CourseSelectorContainerProps {
  planId: string;
  courses: string[];
  transferCredits: string[];
  getSearchedDragId: GetDragIdByCourse;
  getRequirementDragId: GetDragIdByCourse;
  courseDragged: boolean;
}

function CourseSelectorContainer({
  planId,
  courses,
  transferCredits,
  getSearchedDragId,
  getRequirementDragId,
  courseDragged,
}: CourseSelectorContainerProps) {
  const {
    data: validationData,
    error,
    isLoading: isValidationLoading,
  } = trpc.validator.degreeValidator.useQuery(planId, {
    // TODO: Fix validator retries.
    // Validator kept retrying when the "REPORT ERROR" button was clicked on. At some point it should stop retrying.
    retry: false,
    trpc: {
      context: {
        // Isolate the validation request from others. Validator is an external service so its reliability
        // should not affect other requets.
        skipBatch: true,
      },
    },
  });

  const { data, isLoading } = trpc.courses.publicGetAllCourses.useQuery();

  const { results, updateQuery } = useFuse<Course>({
    dataSet:
      data?.map((c) => ({ code: `${c.subject_prefix} ${c.course_number}`, title: c.title })) ?? [],

    keys: ['title', 'code'],
    threshold: 0.2,
  });

  const courseResults = useMemo(() => {
    return results.map((result) => {
      return {
        ...result,
        id: uuidv4(),
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
          {taken != -1 ? (
            taken + '/' + min + ' ' + unit
          ) : (
            <Skeleton inline={true} width={100} className={`flex-1`} />
          )}
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
          className={`z-0 h-screen w-[30%] min-w-[30%] overflow-x-hidden ${
            courseDragged ? 'overflow-y-hidden' : 'overflow-y-scroll'
          }`}
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
                  {validationData ? (
                    <CreditsTaken
                      taken={sum}
                      min={
                        validationData.validation.requirements.length > 0
                          ? validationData.validation.requirements[1].min_hours
                          : 120
                      }
                    />
                  ) : (
                    <CreditsTaken taken={-1} min={-1} />
                  )}
                </div>
              </div>
              <h6 className="text-base tracking-tight text-gray-500">
                Drag courses onto your plan
              </h6>
            </div>
            <div className="z-[999] drop-shadow-2xl">
              <AnalyticsWrapper analyticsClass="umami--click--search-course">
                <SearchBar
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
                    <div className="w-full border-[2px] border-[#EDEFF7] bg-white p-4 drop-shadow-2xl">
                      <DraggableCourseList courses={courseResults} getDragId={getSearchedDragId} />
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              )}
            </Dialog.Root>

            {error?.data?.code === 'INTERNAL_SERVER_ERROR' && (
              <div className="flex h-[30vh] w-full text-base leading-5 text-[#A3A3A3]">
                <div className="mx-12 mt-44 flex w-full flex-col items-center justify-center gap-4 text-center leading-6">
                  It seems like a screw has gone loose!
                  <a href="https://airtable.com/shrFg9MPi9BGguwPU">
                    <Button>REPORT ERROR</Button>
                  </a>
                </div>
              </div>
            )}

            {validationData &&
              validationData.validation.requirements.length > 0 &&
              validationData.validation.requirements.map((req: DegreeRequirement, idx: number) => (
                <RequirementsContainer
                  key={idx}
                  degreeRequirement={req}
                  courses={courses}
                  getCourseItemDragId={getRequirementDragId}
                />
              ))}
            {!validationData && <AccordionSkeleton />}
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

export default memo(CourseSelectorContainer);
