import { UniqueIdentifier, useDraggable } from '@dnd-kit/core';
import React, { FC } from 'react';

import { Course, DragDataFromCourseList } from './Planner';

interface CourseItemProps extends React.ComponentPropsWithoutRef<'div'> {
  courseName: string;
}

const CourseListCourseItem = React.forwardRef<HTMLDivElement, CourseItemProps>(function CourseItem(
  { courseName, ...props },
  ref,
) {
  return (
    <div ref={ref} className={`bg-white rounded-md border-2 flex items-center px-4`} {...props}>
      {courseName}
    </div>
  );
});

interface DraggableCourseListCourseItemProps extends React.ComponentPropsWithoutRef<'div'> {
  dragId: UniqueIdentifier;
  course: Course;
}

const DraggableCourseListCourseItem: FC<DraggableCourseListCourseItemProps> = ({
  dragId,
  course,
  ...props
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: dragId,
    data: { from: 'course-list', course } as DragDataFromCourseList,
  });

  return (
    <CourseListCourseItem
      ref={setNodeRef}
      courseName={course.name}
      {...attributes}
      {...listeners}
      {...props}
      style={{ ...props.style, opacity: isDragging ? '0.5' : undefined }}
    />
  );
};

export default DraggableCourseListCourseItem;
