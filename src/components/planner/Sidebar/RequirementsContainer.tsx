import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import * as HoverCard from '@radix-ui/react-hover-card';
import React, { useState } from 'react';

import useSearch from '@/components/search/search';
import { trpc } from '@/utils/trpc';
import { courses as Course } from 'prisma/generated/platform';

import Accordion from './Accordion';
import { RecursiveRequirement } from './RecursiveRequirement';
import RequirementsCarousel from './RequirementsCarousel';
import RequirementSearchBar from './RequirementSearchBar';
import {
  RequirementGroupTypes,
  RequirementTypes,
  CourseRequirement,
  DegreeRequirement,
} from './types';
import { useSemestersContext } from '../SemesterContext';
import { GetDragIdByCourseAndReq } from '../types';

function RequirementContainerHeader({
  name,
  progress,
  setCarousel,
}: {
  name: string;
  progress: { value: number; max: number; unit: string };
  setCarousel: (state: boolean) => void;
}) {
  const { value, max, unit } = progress;
  return (
    <div className="flex w-full flex-row items-start justify-start">
      <button onClick={() => setCarousel(false)}>
        <svg
          width="30"
          height="27"
          viewBox="0 -12 60 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.4504 26.0646C14.0988 26.4162 13.622 26.6136 13.1248 26.6136C12.6276 26.6136 12.1508 26.4162 11.7991 26.0646L0.548982 14.8145C0.197469 14.4629 0 13.986 0 13.4889C0 12.9917 0.197469 12.5148 0.548982 12.1632L11.7991 0.91306C12.1528 0.571509 12.6264 0.382518 13.118 0.38679C13.6097 0.391062 14.0799 0.588256 14.4276 0.935901C14.7752 1.28355 14.9724 1.75383 14.9767 2.24545C14.981 2.73708 14.792 3.21071 14.4504 3.56435L6.40094 11.6138H28.125C28.6223 11.6138 29.0992 11.8114 29.4508 12.163C29.8025 12.5146 30 12.9916 30 13.4889C30 13.9861 29.8025 14.4631 29.4508 14.8147C29.0992 15.1663 28.6223 15.3639 28.125 15.3639H6.40094L14.4504 23.4134C14.8019 23.765 14.9994 24.2418 14.9994 24.739C14.9994 25.2362 14.8019 25.713 14.4504 26.0646Z"
            fill="#1C2A6D"
          />
        </svg>
      </button>
      <div className="w-full overflow-hidden">
        <div className="flex w-full flex-row items-center justify-between font-medium">
          <HoverCard.Root>
            <HoverCard.Trigger asChild>
              <div className="w-[70%] overflow-hidden text-ellipsis whitespace-nowrap text-[18px] font-semibold">
                {name}
              </div>
            </HoverCard.Trigger>
            <HoverCard.Portal>
              <HoverCard.Content className="z-[999] w-[250px] animate-[slideUpAndFade_0.3s] rounded-md border border-neutral-200 bg-generic-white p-5 shadow-sm">
                <h3 className="mb-2 text-lg font-semibold">{name}</h3>

                <HoverCard.Arrow className="fill-primary" />
              </HoverCard.Content>
            </HoverCard.Portal>
          </HoverCard.Root>

          <div className="w-fit text-[14px] font-medium">
            {value}/{max} {unit}
          </div>
        </div>

        <ProgressComponent2 value={value} max={max} unit={'hours'} />
      </div>
    </div>
  );
}

const getRequirementGroup = (
  degreeRequirement: RequirementGroupTypes,
  allCourses: Course[] | undefined,
): {
  name: string;
  progress: { value: number; max: number; unit: string };
  description: string;
  req: RequirementGroupTypes;
  getData: () => Promise<RequirementTypes[]>;
  filterFunction: (elm: RequirementTypes, query: string) => boolean;
} => {
  const filterFunc = (elm: RequirementTypes, query: string) => {
    query = query.toLowerCase();
    switch (elm.matcher) {
      case 'Course':
        return elm.course.toLowerCase().includes(query);
      case 'Or':
        return elm.metadata && elm.metadata.name
          ? elm.metadata.name.toLowerCase().includes(query)
          : true;
      case 'And':
        return elm.metadata && elm.metadata.name
          ? elm.metadata.name.toLowerCase().includes(query)
          : true;
      case 'Select':
        return elm.metadata && elm.metadata.name
          ? elm.metadata.name.toLowerCase().includes(query)
          : true;
      default:
        return true;
    }
  };

  let courses: string[] = [];
  switch (degreeRequirement.matcher) {
    case 'And':
      return {
        name: degreeRequirement.metadata.name,

        progress: {
          value: degreeRequirement.num_fulfilled_requirements,
          max: degreeRequirement.num_requirements,
          unit: 'reqs',
        },
        description: degreeRequirement.metadata.description ?? '',
        req: degreeRequirement,
        getData: () => Promise.resolve(degreeRequirement.requirements),
        filterFunction: filterFunc,
      };
    case 'Hours':
      return {
        name: degreeRequirement.metadata.name,

        progress: {
          value: degreeRequirement.fulfilled_hours,
          max: degreeRequirement.required_hours,
          unit: 'hours',
        },
        description: degreeRequirement.metadata.description ?? '',
        req: degreeRequirement,
        getData: () => Promise.resolve(degreeRequirement.requirements),
        filterFunction: filterFunc,
      };
    case 'FreeElectives':
      courses = Object.keys(degreeRequirement.valid_courses);

      return {
        name: 'Free Electives',
        progress: {
          value: degreeRequirement.fulfilled_hours,
          max: degreeRequirement.required_hours,
          unit: 'hours',
        },
        description: degreeRequirement.metadata.description ?? '',
        req: degreeRequirement,
        getData: async () =>
          allCourses
            ? allCourses.map((c) => ({
                course: `${c.subject_prefix} ${c.course_number}`,
                matcher: 'Course',
                filled: courses.includes(`${c.subject_prefix} ${c.course_number}`),
                metadata: {},
              }))
            : [],
        filterFunction: filterFunc,
      };
    case 'CS Guided Electives':
      courses = Object.keys(degreeRequirement.valid_courses);
      return {
        name: degreeRequirement.metadata.name ?? 'CS Guided Electives',

        progress: {
          value: degreeRequirement.fulfilled_count,
          max: degreeRequirement.required_count,
          unit: 'courses',
        },
        description: degreeRequirement.metadata.description ?? '',
        req: degreeRequirement,
        getData: async () =>
          allCourses
            ? (allCourses
                .map((c) => ({
                  course: `${c.subject_prefix} ${c.course_number}`,
                  matcher: 'Course',
                  filled: courses.includes(`${c.subject_prefix} ${c.course_number}`),
                }))
                .filter((c) => c.course.includes('CS 43')) as CourseRequirement[])
            : [],
        filterFunction: filterFunc,
      };

    default: {
      return {
        name: '',

        progress: { value: 0, max: 1, unit: 'none' },
        req: degreeRequirement,
        description: '',
        getData: () => Promise.resolve([] as RequirementTypes[]),
        filterFunction: (_, __) => true,
      };
    }
  }
};

export const ProgressComponent2 = ({
  value,
  max,
  unit = 'done',
}: {
  value: number;
  max: number;
  unit?: string;
}) => {
  const heh = `${(value * 100) / max}%`;

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="mt-2 h-1 w-full overflow-hidden rounded-2xl bg-[#F5F5F5] ">
        <div style={{ width: heh }} className={`h-full bg-primary`}></div>
      </div>
    </div>
  );
};

export const ProgressComponent = ({
  value,
  max,
  unit = 'done',
}: {
  value: number;
  max: number;
  unit?: string;
}) => {
  const heh = `${(value * 100) / max}%`;

  return (
    <div className="flex w-24 flex-col items-center justify-center">
      <div className="w-max text-[10px]">
        {value}/{max} {unit}
      </div>
      <div className="h-3 w-full overflow-hidden rounded-2xl bg-[#F5F5F5]">
        <div style={{ width: heh }} className={`h-full bg-primary`}></div>
      </div>
    </div>
  );
};

export const displayRequirementProgress = (elm: RequirementGroupTypes) => {
  switch (elm.matcher) {
    case 'And':
      return { value: elm.num_fulfilled_requirements, max: elm.num_requirements };
    case 'CS Guided Electives':
      return { value: elm.fulfilled_count, max: elm.required_count };
    case 'FreeElectives':
      return { value: elm.fulfilled_hours, max: elm.required_hours };
    case 'Hours':
      return { value: elm.fulfilled_hours, max: elm.required_hours };
    default:
      return { value: 0, max: 100 };
  }
};

export interface RequirementsContainerProps {
  degreeRequirement: DegreeRequirement;
  courses: string[];
  getCourseItemDragId: GetDragIdByCourseAndReq;
}

export default function RequirementsContainer({
  degreeRequirement,
  courses,
  getCourseItemDragId,
}: RequirementsContainerProps) {
  const [requirementIdx, setRequirementIdx] = React.useState<number>(0);

  const q = trpc.courses.publicGetAllCourses.useQuery(undefined, {
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });

  /**
   * These hooks manage the carousel state for RequirementsCarousel
   */
  const [carousel, setCarousel] = React.useState<boolean>(false);

  // Note: this logic hides overflow during sliding animation
  const [overflow, setOverflow] = useState(false);

  function toggleCarousel() {
    setOverflow(true);
    setCarousel(!carousel);
  }

  const { bypasses } = useSemestersContext();

  return (
    <RequirementsCarousel
      overflow={overflow}
      setOverflow={setOverflow}
      carousel={carousel}
      requirementsList={
        <Accordion
          startOpen={false}
          header={
            <div className="mr-2 flex w-[calc(100%-2rem)] flex-row justify-between gap-2 ">
              <div className="my-1 overflow-hidden text-ellipsis whitespace-nowrap text-start text-xl  font-semibold  ">
                {degreeRequirement.name}
              </div>

              <ProgressComponent
                value={degreeRequirement.num_fulfilled_requirements}
                max={degreeRequirement.num_requirements}
              />
            </div>
          }
        >
          <>
            {degreeRequirement.requirements.map((elm, idx) => {
              const { name } = getRequirementGroup(elm, q.data);
              const { value, max } = displayRequirementProgress(elm);

              const id = elm.metadata.id.toString();

              const hasBypass = bypasses.includes(id);

              const rightValue = hasBypass ? max : value;

              return (
                <button
                  key={idx}
                  onClick={() => {
                    toggleCarousel();
                    setRequirementIdx(idx);
                  }}
                >
                  <div
                    className="flex items-center justify-between gap-x-4 rounded-md border border-neutral-300 px-5 py-4"
                    key={idx}
                  >
                    <div className="w-[50%] flex-grow justify-start overflow-hidden text-ellipsis whitespace-nowrap text-start font-medium lg:w-4/5">
                      {name}
                    </div>
                    <div className="flex items-center">
                      <div className="flex flex-row items-center px-[5px] text-[11px]">
                        <ProgressComponent value={value} max={max} />
                      </div>
                      <ChevronRightIcon />
                    </div>
                  </div>
                </button>
              );
            })}
          </>
        </Accordion>
      }
      requirementInfo={
        <RequirementContainer
          degreeRequirement={degreeRequirement.requirements[requirementIdx]}
          courses={courses}
          setCarousel={toggleCarousel}
          getCourseItemDragId={getCourseItemDragId}
        />
      }
    ></RequirementsCarousel>
  );
}

export interface RequirementContainerProps {
  degreeRequirement: RequirementGroupTypes;
  courses: string[];
  setCarousel: (state: boolean) => void;
  getCourseItemDragId: GetDragIdByCourseAndReq;
}

function RequirementContainer({
  degreeRequirement,
  setCarousel,
  courses,
}: RequirementContainerProps): JSX.Element {
  const q = trpc.courses.publicGetAllCourses.useQuery(undefined, {
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });

  // Handles logic for displaying correct requirement group
  const { name, progress, description, getData, filterFunction } = getRequirementGroup(
    degreeRequirement,
    q.data,
  );

  const { results, updateQuery } = useSearch({
    getData: getData,
    initialQuery: '',
    filterFn: filterFunction,
    constraints: [0, 3000],
  });

  React.useEffect(() => {
    updateQuery('');
  }, [degreeRequirement]);

  // Put filled requirements first
  const sortedResults = [...results]
    .sort((req1, req2) => {
      if (req1.filled && !req2.filled) {
        return -1;
      } else if (req2.filled && !req1.filled) {
        return 1;
      }
      return 0;
    })
    .slice(0, 100);

  const { planId, bypasses, handleAddBypass, handleRemoveBypass } = useSemestersContext();

  const hasBypass = bypasses.includes(degreeRequirement.metadata.id.toString());

  const handleUpdateBypass = () => {
    hasBypass
      ? handleRemoveBypass({ planId, requirement: degreeRequirement.metadata.id.toString() })
      : handleAddBypass({ planId, requirement: degreeRequirement.metadata.id.toString() });
  };

  // Handles logic for adding bypass to requirement
  return (
    <>
      <RequirementContainerHeader name={name} progress={progress} setCarousel={setCarousel} />
      <div className="text-[14px]">{description}</div>

      <div className=" flex h-full flex-col gap-y-2 overflow-x-hidden">
        <RequirementSearchBar updateQuery={updateQuery} />
        {sortedResults.map((req, idx) => {
          return (
            <RecursiveRequirement
              key={idx}
              req={req}
              courses={courses}
              validCourses={
                degreeRequirement.matcher === 'Hours' ? degreeRequirement.valid_courses : {}
              }
            />
          );
        })}
      </div>
    </>
  );
}
