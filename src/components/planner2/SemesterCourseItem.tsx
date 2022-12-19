import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ComponentPropsWithoutRef, FC, forwardRef } from 'react';

import { Course, DragDataFromSemesterTile, Semester } from './Planner';

interface SemesterCourseItemProps extends ComponentPropsWithoutRef<'div'> {
  courseName: string;
}

const SemesterCourseItem = forwardRef<HTMLDivElement, SemesterCourseItemProps>(
  function SemesterCourseItem({ courseName, ...props }, ref) {
    return (
      <div ref={ref} {...props}>
        {courseName}
      </div>
    );
  },
);

export interface DraggableSemesterCourseItemProps {
  id: UniqueIdentifier;
  semester: Semester;
  course: Course;
}

const DraggableSemesterCourseItem: FC<DraggableSemesterCourseItemProps> = ({
  id,
  semester,
  course,
}) => {
  const { setNodeRef, transform, transition, attributes, listeners } = useSortable({
    id,
    data: { from: 'semester-tile', semester, course } as DragDataFromSemesterTile,
  });

  return (
    <SemesterCourseItem
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      courseName={course.name}
    />
  );
};

export default DraggableSemesterCourseItem;
