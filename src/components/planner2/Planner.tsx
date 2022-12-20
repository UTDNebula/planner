/**
 * Uses @dnd-kit library
 * Follows presentational, compositional component philosophy b/c lots of wrappers, easier to read
 * https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0
 *
 * @dnd-kit heavily relies on IDs
 * No two ids under DndContext should be the same
 * All ids are generated in <PlannerTool /> (hence getId callback) and bubbled down, for clarity
 *
 * @dnd-kit allows data to be passed into drag events
 * DragEventData types meant to force typing onto drag event data
 * Be very careful when adding @dnd-kit presets (eg. @dnd-kit/sortable) or new data types
 */
import { DndContext, DragOverlay, pointerWithin, UniqueIdentifier } from '@dnd-kit/core';
import React, { FC, useState } from 'react';

import DraggableCourseListCourseItem, { CourseListCourseItem } from './CourseListCourseItem';
import { SemesterCourseItem } from './SemesterCourseItem';
import DroppableSemesterTile from './SemesterTile';

/**
 * Temporary types
 * TODO: Remove
 */
export interface Semester {
  id: UniqueIdentifier;
  name: string;
  courses: Course[];
}

export interface Course {
  id: UniqueIdentifier;
  name: string;
  validation?: { isValid: boolean; override: boolean };
}

/**
 * Data from drag event origin and destination
 * Drag origin is referred to as 'active' by @dnd-kit
 * Drag destination is referred to as 'over' by @dnd-kit
 */
export type DragEventOriginData = DragDataFromSemesterTile | DragDataFromCourseList;

export interface DragDataFromSemesterTile {
  from: 'semester-tile';
  semester: Semester;
  course: Course;
}

export interface DragDataFromCourseList {
  from: 'course-list';
  course: Course;
}

export type DragEventDestinationData = DragDataToSemesterTile;

export interface DragDataToSemesterTile {
  to: 'semester-tile';
  semester: Semester;
}

/** Date stored during drag */
interface ActiveDragData {
  from: 'semester-tile' | 'course-list';
  course: Course;
}

export interface ToastMessage {
  message: string;
  level: 'ok' | 'warn' | 'error';
}

/** PlannerTool Props */
export interface PlannerToolProps {
  courses: Course[];
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
export const PlannerTool: FC<PlannerToolProps> = ({
  courses,
  semesters,
  onAddCourseToSemester,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
  onRemoveCourseFromSemester,
  onMoveCourseFromSemesterToSemester,
}) => {
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
        <section className="flex flex-col gap-[4px]">
          {courses.map((course) => (
            <DraggableCourseListCourseItem
              key={course.id}
              dragId={`course-list-${course.id}`}
              style={{
                width: '300px',
                height: '50px',
              }}
              course={course}
            />
          ))}

          <DragOverlay dropAnimation={null}>
            {activeCourse &&
              (activeCourse.from === 'semester-tile' ? (
                <SemesterCourseItem courseName={activeCourse.course.name} />
              ) : (
                // TODO: Replace with Caleb's implementation of course item
                <CourseListCourseItem
                  courseName={activeCourse.course.name}
                  style={{
                    width: '300px',
                    height: '50px',
                  }}
                />
              ))}
          </DragOverlay>
        </section>

        <div className="flex flex-wrap gap-[32px]">
          {semesters.map((semester) => {
            const hasInvalidCourse =
              semester.courses.length > 0 &&
              semester.courses.some((course) => course.validation && !course.validation.isValid);

            return (
              <DroppableSemesterTile
                key={semester.id}
                dropId={`semester-${semester.id}`}
                getSemesterCourseDragId={(semester, course) =>
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
};
