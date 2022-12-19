import { DndContext, DragOverlay, pointerWithin, UniqueIdentifier } from '@dnd-kit/core';
import React, { FC, useState } from 'react';

import DraggableCourseListCourseItem from './CourseListCourseItem';
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

/**
 * Controlled wrapper around course list and semester tiles
 */
export interface PlannerToolProps {
  courses: Course[];
  semesters: Semester[];
  setSemesters: (semesters: Semester[]) => void;
}

export const PlannerTool: FC<PlannerToolProps> = ({ courses, semesters, setSemesters }) => {
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragStart={({ active }) =>
        setActiveCourse((active.data.current as DragEventOriginData).course)
      }
      onDragEnd={({ active, over }) => {
        setActiveCourse(null);
        console.log({ active, over });

        if (active && over) {
          const originData = active.data.current as DragEventOriginData;
          const destinationData = over.data.current as DragEventDestinationData;

          // attempting to drop item on its existing container
          if (active.id == over.id && originData.from === destinationData.to) return;

          // from course list -> semester
          if (originData.from === 'course-list' && destinationData.to === 'semester-tile') {
            const semesterId = destinationData.semester.id;
            setSemesters(
              semesters.map((semester) => {
                if (semester.id != semesterId) return semester;

                // if duplicate course in destination semester
                if (semester.courses.find((course) => course.id === originData.course.id))
                  return semester;

                return { ...semester, courses: [...semester.courses, originData.course] };
              }),
            );
          }

          // from semester -> semester
          if (originData.from === 'semester-tile' && destinationData.to === 'semester-tile') {
            // if duplicate course in destination semester
            const isDuplicate = Boolean(
              semesters
                .find((semester) => semester.id === destinationData.semester.id)
                ?.courses.find((course) => course.id === originData.course.id),
            );
            if (isDuplicate) return;

            setSemesters(
              semesters.map((semester) => {
                // add course to destination semester
                if (semester.id === destinationData.semester.id) {
                  return {
                    ...semester,
                    courses: [...semester.courses, originData.course],
                  };
                }

                // remove course from origin semester
                if (semester.id === originData.semester.id) {
                  return {
                    ...semester,
                    courses: semester.courses.filter(
                      (course) => course.id !== originData.course.id,
                    ),
                  };
                }

                return semester;
              }),
            );
          }
          //
        }
      }}
    >
      <div className="grid grid-cols-[auto_1fr]">
        <section className="flex flex-col gap-[4px]">
          {courses.map((course) => (
            <DraggableCourseListCourseItem
              key={course.id}
              id={course.id.toString() + 'cl'}
              style={{
                width: '300px',
                height: '50px',
              }}
              course={course}
            />
          ))}

          <DragOverlay dropAnimation={null}>
            {activeCourse && <div>{activeCourse.name}</div>}
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
