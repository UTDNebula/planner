/**
 * Uses @dnd-kit library
 *
 * @dnd-kit heavily relies on IDs
 * No two ids under DndContext should be the same
 * All ids are generated in <PlannerTool /> (hence getId callback) and bubbled down, for clarity
 *
 * @dnd-kit allows data to be passed into drag events
 * DragEventData types meant to force typing onto drag event data
 * Be very careful when adding @dnd-kit presets (eg. @dnd-kit/sortable) or new data sources
 * Adding DndContext hooks (eg. useDraggable) without considering 'data' property will cause unexpected behaviors
 */
import { trpc } from '@/utils/trpc';
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  pointerWithin,
  useSensor,
  useSensors,
  Active,
  Over,
} from '@dnd-kit/core';
import { toast } from 'react-toastify';
import React, { useMemo, useState } from 'react';

import CourseSelectorContainer from './Sidebar/Sidebar';
import { SidebarCourseItem } from './Sidebar/SidebarCourseItem';
import { SemesterCourseItem } from './Tiles/SemesterCourseItem';
import DroppableSemesterTile from './Tiles/SemesterTile';
import {
  ActiveDragData,
  DegreeRequirementGroup,
  DragEventDestinationData,
  DragEventOriginData,
  DraggableCourse,
  Semester,
} from './types';
import { isSemCodeEqual } from '@/utils/utilFunctions';
import { SemesterCode } from '@prisma/client';
import Toolbar from './Toolbar';

/** PlannerTool Props */
export interface PlannerProps {
  degreeRequirements: DegreeRequirementGroup[];
  semesters: Semester[];
  showTransfer: boolean;
  handleAddCourseToSemester: (targetSemester: Semester, newCourse: DraggableCourse) => void;
  handleMoveCourseFromSemesterToSemester: (
    originSemester: Semester,
    destinationSemester: Semester,
    courseToMove: DraggableCourse,
  ) => void;

  handleRemoveCourseFromSemester: (targetSemester: Semester, targetCourse: DraggableCourse) => void;
  handleAddYear: () => void;
  handleRemoveYear: () => void;
}

/** Controlled wrapper around course list and semester tiles */
export default function Planner({
  degreeRequirements,
  semesters,
  showTransfer,
  handleAddCourseToSemester,
  handleMoveCourseFromSemesterToSemester,
  handleRemoveCourseFromSemester,
  handleAddYear,
  handleRemoveYear,
}: PlannerProps): JSX.Element {
  // Course that is currently being dragged
  const [activeCourse, setActiveCourse] = useState<ActiveDragData | null>(null);

  // Delay necessary so events inside draggables propagate
  // valid sensors: https://github.com/clauderic/dnd-kit/discussions/82#discussioncomment-347608
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
  );

  // Get credits to check if semester invalid
  const creditsQuery = trpc.credits.getCredits.useQuery(undefined, { staleTime: 10000000000 });
  const credits = creditsQuery.data;

  const courses = useMemo(
    () => semesters.flatMap((sem) => sem.courses).map((course) => course.code),
    [semesters],
  );
  const handleOnDragStart = ({ active }: { active: Active }) => {
    const originData = active.data.current as DragEventOriginData;
    setActiveCourse({ from: originData.from, course: originData.course });
  };

  const handleOnDragEnd = ({ active, over }: { active: Active; over: Over | null }) => {
    setActiveCourse(null);

    if (active && over) {
      const originData = active.data.current as DragEventOriginData;
      const destinationData = over.data.current as DragEventDestinationData;

      // from semester -> current semester
      // attempting to drop semester course on current tile
      if (
        originData.from === 'semester-tile' &&
        destinationData.to === 'semester-tile' &&
        originData.semester.id === destinationData.semester.id
      ) {
        toast.warn(
          `You're already taking ${originData.course.code} in ${originData.semester.code.year}${originData.semester.code.semester}`,
        );
        return;
      }

      // from course list -> semester
      if (originData.from === 'course-list' && destinationData.to === 'semester-tile') {
        handleAddCourseToSemester(destinationData.semester, originData.course);
      }

      // from semester -> another semester
      if (originData.from === 'semester-tile' && destinationData.to === 'semester-tile') {
        handleMoveCourseFromSemesterToSemester(
          originData.semester,
          destinationData.semester,
          originData.course,
        );
      }
    }
  };

  return (
    <DndContext
      // Enabling autoScroll causes odd behavior when dragging outside of a scrollable container (eg. Sidebar)
      autoScroll={false}
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleOnDragStart}
      onDragEnd={handleOnDragEnd}
    >
      <div className="grid w-full grid-cols-[auto_1fr] gap-[52px]">
        <CourseSelectorContainer
          courses={courses}
          degreeRequirements={degreeRequirements}
          getSearchedDragId={(course) => `course-list-searched-${course.id}`}
          getRequirementDragId={(course) => `course-list-requirement-${course.id}`}
        />
        <DragOverlay dropAnimation={null}>
          {activeCourse &&
            (activeCourse.from === 'semester-tile' ? (
              <SemesterCourseItem course={activeCourse.course} />
            ) : activeCourse.from === 'course-list' ? (
              <SidebarCourseItem course={activeCourse.course} />
            ) : null)}
        </DragOverlay>

        <section className="flex min-h-fit w-fit flex-col gap-y-6">
          <Toolbar title="Plan Your Courses" major="Computer Science" />

          <section className="grid h-auto w-fit grid-cols-3 gap-[32px]">
            {semesters.map((semester) => {
              // Get map of credits (faster to query later down the line)
              const creditsMap: {
                [key: string]: { semesterCode: SemesterCode; transfer: boolean };
              } = credits?.reduce((prev, curr) => ({ ...prev, [curr.courseCode]: curr }), {}) ?? [];

              const semesterCredits: {
                [key: string]: { semesterCode: SemesterCode; transfer: boolean };
              } =
                credits
                  ?.filter((credit) => isSemCodeEqual(credit.semesterCode, semester.code))
                  .reduce((prev, curr) => ({ ...prev, [curr.courseCode]: curr }), {}) ?? [];

              const numSemesterCredits = Object.keys(semesterCredits).length;

              const semesterErrors: SemesterErrors = {
                isError: false,
                prerequisites: [],
                sync: { missing: [], extra: [] },
              };

              const coursesWithErrors: DraggableCourse[] = semester.courses.map((course) => {
                let correctSemester: SemesterCode | undefined;

                const isSynced =
                  (numSemesterCredits === 0 && !(course.code in creditsMap)) ||
                  (course.code in creditsMap &&
                    isSemCodeEqual(creditsMap[course.code].semesterCode, semester.code));
                if (isSynced) {
                  delete semesterCredits[course.code];
                } else {
                  semesterErrors.isError = true;
                  semesterErrors.sync.extra.push(course.code);

                  // Check course in credits
                  if (course.code in creditsMap)
                    correctSemester = creditsMap[course.code].semesterCode;
                }

                // TODO: This is prolly where prereq validation should take place
                return {
                  ...course,
                  transfer: course.code in creditsMap && creditsMap[course.code].transfer,
                  taken: course.code in creditsMap,
                  sync: { isSynced, correctSemester },
                };
              });

              // Add missing courses
              semesterErrors.sync.missing = Object.keys(semesterCredits);

              const newSem = {
                ...semester,
                courses: showTransfer
                  ? coursesWithErrors
                  : coursesWithErrors.filter((course) => !course.transfer),
              };

              return (
                <DroppableSemesterTile
                  onRemoveCourse={handleRemoveCourseFromSemester}
                  key={semester.id.toString()}
                  dropId={`semester-${semester.id}`}
                  getSemesterCourseDragId={(course, semester) =>
                    `semester-tile-course-${semester.id}-${course.id}`
                  }
                  semester={newSem}
                  semesterErrors={semesterErrors}
                />
              );
            })}
            <div className="col-span-full flex h-10 items-center justify-center gap-8">
              <button onClick={handleRemoveYear}>- Remove Year</button>
              <button onClick={handleAddYear}>+ Add Year</button>
            </div>
          </section>
        </section>
      </div>
    </DndContext>
  );
}

export type SemesterErrors = {
  isError: boolean;
  prerequisites: string[];
  sync: {
    missing: string[];
    extra: string[];
  };
};
