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
import React, { useState } from 'react';
import { DndContext, DragOverlay, pointerWithin } from '@dnd-kit/core';
import { SidebarCourseItem } from './Sidebar/SidebarCourseItem';
import { SemesterCourseItem } from './Tiles/SemesterCourseItem';
import DroppableSemesterTile from './Tiles/SemesterTile';
import CourseSelectorContainer from './Sidebar/Sidebar';
import {
  Semester,
  ToastMessage,
  DragEventOriginData,
  ActiveDragData,
  DragEventDestinationData,
  DegreeRequirementGroup,
} from './types';
import { Course } from '@/modules/common/data';

/** PlannerTool Props */
export interface PlannerProps {
  degreeRequirements: DegreeRequirementGroup[];
  semesters: Semester[];
  /** Called when course moved from course list -> semester */
  onAddCourseToSemester?: (targetSemester: Semester, newCourse: Course) => Promise<ToastMessage>;
  /** Called when course removed from semester */
  onRemoveCourseFromSemester?: (
    targetSemester: Semester,
    courseToRemove: Course,
  ) => Promise<ToastMessage>;
  /** Called when courese moved from semester -> semester */
  onMoveCourseFromSemesterToSemester?: (
    originSemester: Semester,
    destinationSemester: Semester,
    courseToMove: Course,
  ) => Promise<ToastMessage>;
}

/** Controlled wrapper around course list and semester tiles */
export default function Planner({
  degreeRequirements,
  semesters,
  onAddCourseToSemester,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
  onRemoveCourseFromSemester,
  onMoveCourseFromSemesterToSemester,
}: PlannerProps): JSX.Element {
  // Course that is currently being dragged
  const [activeCourse, setActiveCourse] = useState<ActiveDragData | null>(null);

  return (
    <DndContext
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
      <div className="grid grid-cols-[auto_1fr]">
        <CourseSelectorContainer
          degreeRequirements={degreeRequirements}
          getSearchedDragId={(course) => `course-list-searched-${course.id}`}
          getRequirementDragId={(course) => `course-list-requirement-${course.id}`}
        />
        <DragOverlay dropAnimation={null}>
          {activeCourse &&
            (activeCourse.from === 'semester-tile' ? (
              <SemesterCourseItem courseName={activeCourse.course.catalogCode} />
            ) : activeCourse.from === 'course-list' ? (
              <SidebarCourseItem course={activeCourse.course} />
            ) : null)}
        </DragOverlay>

        <div className="flex flex-wrap gap-[32px]">
          {semesters.map((semester) => {
            const hasInvalidCourse =
              semester.courses.length > 0 &&
              semester.courses.some((course) => course.validation && !course.validation.isValid);

            return (
              <DroppableSemesterTile
                key={semester.id}
                dropId={`semester-${semester.id}`}
                getSemesterCourseDragId={(course, semester) =>
                  `semester-tile-course-${semester.id}-${course.id}`
                }
                semester={semester}
                isValid={!hasInvalidCourse}
              />
            );
          })}
        </div>
      </div>
    </DndContext>
  );
}
