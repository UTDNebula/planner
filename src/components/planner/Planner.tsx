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
  MouseSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
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
  ToastMessage,
} from './types';

/** PlannerTool Props */
export interface PlannerProps {
  degreeRequirements: DegreeRequirementGroup[];
  semesters: Semester[];
  /** Called when course moved from course list -> semester */
  onAddCourseToSemester?: (
    targetSemester: Semester,
    newCourse: DraggableCourse,
  ) => Promise<ToastMessage>;
  /** Called when course removed from semester */
  onRemoveCourseFromSemester: (
    targetSemester: Semester,
    courseToRemove: DraggableCourse,
  ) => Promise<ToastMessage>;
  /** Called when courese moved from semester -> semester */
  onMoveCourseFromSemesterToSemester?: (
    originSemester: Semester,
    destinationSemester: Semester,
    courseToMove: DraggableCourse,
  ) => Promise<ToastMessage>;
  onRemoveYear: () => Promise<void>;
  onAddYear: () => Promise<void>;
}

/** Controlled wrapper around course list and semester tiles */
export default function Planner({
  degreeRequirements,
  semesters,
  onAddCourseToSemester,
  onRemoveCourseFromSemester,
  onMoveCourseFromSemesterToSemester,
  onRemoveYear,
  onAddYear,
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

  const courses = useMemo(
    () => semesters.flatMap((sem) => sem.courses).map((course) => course.code),
    [semesters],
  );

  return (
    <DndContext
      // Enabling autoScroll causes odd behavior when dragging outside of a scrollable container (eg. Sidebar)
      autoScroll={false}
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={({ active }) => {
        const originData = active.data.current as DragEventOriginData;
        setActiveCourse({ from: originData.from, course: originData.course });
      }}
      onDragEnd={({ active, over }) => {
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
          )
            return;

          // from course list -> semester
          if (
            originData.from === 'course-list' &&
            destinationData.to === 'semester-tile' &&
            onAddCourseToSemester
          ) {
            onAddCourseToSemester(destinationData.semester, originData.course).then(
              (notification) =>
                // TODO: push message to toast notifications
                console.log(notification.message),
            );
          }

          // from semester -> another semester
          if (
            originData.from === 'semester-tile' &&
            destinationData.to === 'semester-tile' &&
            onMoveCourseFromSemesterToSemester
          ) {
            onMoveCourseFromSemesterToSemester(
              originData.semester,
              destinationData.semester,
              originData.course,
            ).then((notification) => {
              // TODO: push message to toast notifications
              console.log(notification.message);
            });
          }
        }
      }}
    >
      <div className="w-full grid grid-cols-[auto_1fr] gap-[52px]">
        <CourseSelectorContainer
          courses={courses}
          degreeRequirements={degreeRequirements}
          getSearchedDragId={(course) => `course-list-searched-${course.id}`}
          getRequirementDragId={(course) => `course-list-requirement-${course.id}`}
        />
        <DragOverlay dropAnimation={null}>
          {activeCourse &&
            (activeCourse.from === 'semester-tile' ? (
              <SemesterCourseItem course={activeCourse.course} isDisabled={false} />
            ) : activeCourse.from === 'course-list' ? (
              <SidebarCourseItem course={activeCourse.course} />
            ) : null)}
        </DragOverlay>

        <div className="min-h-fit">
          <div className="grid grid-cols-3 grid-rows-4 w-fit gap-[32px]">
            {semesters.map((semester) => {
              const hasInvalidCourse =
                semester.courses.length > 0 &&
                semester.courses.some((course) => course.validation && !course.validation.isValid);

              return (
                <DroppableSemesterTile
                  onRemoveCourse={(semester, course) =>
                    onRemoveCourseFromSemester(semester, course).then((notification) => {
                      // TODO: push message to toast notification
                      console.log(notification.message);
                    })
                  }
                  key={semester.id.toString()}
                  dropId={`semester-${semester.id}`}
                  getSemesterCourseDragId={(course, semester) =>
                    `semester-tile-course-${semester.id}-${course.id}`
                  }
                  semester={semester}
                  isValid={!hasInvalidCourse}
                />
              );
            })}
            <div className="col-span-full flex justify-center items-center gap-8 h-10">
              <button onClick={onRemoveYear}>- Remove Year</button>
              <button onClick={onAddYear}>+ Add Year</button>
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
}
