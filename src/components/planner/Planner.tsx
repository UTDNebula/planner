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
import {
  DndContext,
  DragOverlay,
  pointerWithin,
  useSensor,
  useSensors,
  Active,
  Over,
} from '@dnd-kit/core';
import React, { useMemo, useState, useRef, FC } from 'react';

import CourseSelectorContainer from './Sidebar/Sidebar';
import { SidebarCourseItem } from './Sidebar/SidebarCourseItem';
import { SemesterCourseItem } from './Tiles/SemesterCourseItem';
import DroppableSemesterTile from './Tiles/SemesterTile';
import type {
  ActiveDragData,
  DragEventDestinationData,
  DragEventOriginData,
  Semester,
} from './types';
import { DegreeRequirements } from './Sidebar/types';

import Toolbar from './Toolbar';
import { useSemestersContext } from './SemesterContext';
import SelectedCoursesToast from './SelectedCoursesToast';
import TransferBank from './TransferBank';
import PlannerMouseSensor from './PlannerMouseSensor';

/** PlannerTool Props */
export interface PlannerProps {
  degreeRequirements: DegreeRequirements;
  transferCredits: string[];
}

/** Controlled wrapper around course list and semester tiles */
export default function Planner({
  degreeRequirements,
  transferCredits,
}: PlannerProps): JSX.Element {
  const {
    semesters,
    handleAddCourseToSemester,
    handleAddYear,
    handleMoveCourseFromSemesterToSemester,
    handleRemoveYear,
    selectedCourseCount,
    handleDeselectAllCourses,
    handleSelectCourses,
    handleDeleteAllSelectedCourses,
  } = useSemestersContext();

  // Course that is currently being dragged
  const [activeCourse, setActiveCourse] = useState<ActiveDragData | null>(null);

  // Delay necessary so events inside draggables propagate
  // valid sensors: https://github.com/clauderic/dnd-kit/discussions/82#discussioncomment-347608
  const sensors = useSensors(
    useSensor(PlannerMouseSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
  );

  const courseCodes = useMemo(
    () => semesters.flatMap((sem) => sem.courses).map((course) => course.code),
    [semesters],
  );

  const courseIds = useMemo(
    () => semesters.flatMap((sem) => sem.courses).map((course) => course.id.toString()),
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

      // from course list -> semester
      if (originData.from === 'course-list' && destinationData.to === 'semester-tile') {
        handleAddCourseToSemester(destinationData.semester, originData.course);
      }

      // from semester -> another semester
      if (
        originData.from === 'semester-tile' &&
        destinationData.to === 'semester-tile' &&
        originData.semester.id !== destinationData.semester.id
      ) {
        handleMoveCourseFromSemesterToSemester(
          originData.semester,
          destinationData.semester,
          originData.course,
        );
      }
    }
  };

  const ref = useRef<HTMLDivElement>(null);
  const [columnCount, setColumns] = useState(3);
  // TODO: Use resizeobserver to change column count based on screen size

  return (
    <DndContext
      // Enabling autoScroll causes odd behavior when dragging outside of a scrollable container (eg. Sidebar)
      autoScroll={false}
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleOnDragStart}
      onDragEnd={handleOnDragEnd}
    >
      <SelectedCoursesToast
        show={selectedCourseCount > 0}
        selectedCount={selectedCourseCount}
        areAllCoursesSelected={selectedCourseCount === courseIds.length}
        deleteSelectedCourses={handleDeleteAllSelectedCourses}
        deselectAllCourses={handleDeselectAllCourses}
        selectAllCourses={() => handleSelectCourses(courseIds)}
      />
      <div className="flex flex-row">
        <CourseSelectorContainer
          courses={courseCodes}
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

        <section ref={ref} className="flex max-h-screen flex-grow flex-col gap-y-6 p-4 pb-0">
          <Toolbar title="Plan Your Courses" major="Computer Science" studentName="Dev" />

          <TransferBank transferCredits={transferCredits} />

          <article className="h-full overflow-x-hidden overflow-y-scroll">
            <div className="flex h-fit gap-5">
              {semesters
                .reduce(
                  (acc, curr, index) => {
                    acc[index % 3].push(curr);
                    return acc as Semester[][];
                  },
                  [[], [], []] as Semester[][],
                )
                .map((column, index) => (
                  <MasonryColumn key={`column-${index}`} column={column} />
                ))}
            </div>
            <div className="col-span-full flex h-10 items-center justify-center gap-8">
              <button onClick={handleRemoveYear}>- Remove Year</button>
              <button onClick={handleAddYear}>+ Add Year</button>
            </div>
          </article>
        </section>
      </div>
    </DndContext>
  );
}

const MasonryColumn: FC<{ column: Semester[] }> = ({ column }) => {
  return (
    <div className="flex w-full flex-col gap-5">
      {column.map((semester) => {
        return (
          <DroppableSemesterTile
            key={semester.id.toString()}
            dropId={`semester-${semester.id}`}
            getSemesterCourseDragId={(course, semester) =>
              `semester-tile-course-${semester.id}-${course.id}`
            }
            semester={semester}
          />
        );
      })}
    </div>
  );
};
