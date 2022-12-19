import { DndContext, DragOverlay, pointerWithin, UniqueIdentifier } from '@dnd-kit/core';
import React, { FC, useState } from 'react';

import DraggableCourseListCourseItem from './CourseListCourseItem';
import { SemesterCourseItem } from './SemesterCourseItem';
import DroppableSemesterTile from './SemesterTile';

export interface Semester {
  id: UniqueIdentifier;
  name: string;
  courses: Course[];
}

export interface Course {
  id: UniqueIdentifier;
  name: string;
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

interface ActiveCourseData {
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

/**
 * Controlled wrapper around course list and semester tiles
 */
export const PlannerTool: FC<PlannerToolProps> = ({
  courses,
  semesters,
  onAddCourseToSemester,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
  onRemoveCourseFromSemester,
  onMoveCourseFromSemesterToSemester,
}) => {
  const [activeCourse, setActiveCourse] = useState<ActiveCourseData | null>(null);

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

          // attempting to drop item on its existing container
          if (active.id == over.id && originData.from === destinationData.to) return;

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

          // from semester -> semester
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
              dragId={course.id.toString() + 'cl'}
              style={{
                width: '300px',
                height: '50px',
              }}
              course={course}
            />
          ))}

          <DragOverlay dropAnimation={null}>
            {activeCourse && activeCourse.from === 'semester-tile' ? (
              <SemesterCourseItem courseName={activeCourse.course.name} />
            ) : (
              <div></div>
            )}
          </DragOverlay>
        </section>

        <div className="flex flex-wrap gap-[20px]">
          {semesters.map((semester) => (
            <DroppableSemesterTile key={semester.id} id={'s' + semester.id} semester={semester} />
          ))}
        </div>
      </div>
    </DndContext>
  );
};
