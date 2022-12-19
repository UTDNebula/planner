import { UniqueIdentifier, useDraggable } from '@dnd-kit/core';
import React, { FC, useMemo } from 'react';

import { Course, DragDataFromCourseList } from './Planner';

interface CourseItemProps extends React.ComponentPropsWithoutRef<'div'> {
  isOver?: boolean;
  courseName: string;
  isOverlay?: boolean;
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
  id: UniqueIdentifier;
  course: Course;
}

const DraggableCourseListCourseItem: FC<DraggableCourseListCourseItemProps> = ({
  id,
  course,
  ...props
}) => {
  const { attributes, listeners, setNodeRef, over, isDragging } = useDraggable({
    id,
    data: { from: 'course-list', course } as DragDataFromCourseList,
  });

  const isOver = useMemo(() => Boolean(isDragging && over), [over, isDragging]);

  return (
    <CourseListCourseItem
      ref={setNodeRef}
      isOver={isOver}
      courseName={course.name}
      {...attributes}
      {...listeners}
      {...props}
      style={{ ...props.style, opacity: isDragging ? '0.5' : undefined }}
    />
  );
};

export default DraggableCourseListCourseItem;
