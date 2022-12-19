import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ComponentPropsWithoutRef, FC, forwardRef } from 'react';

import { Course, DragDataFromSemesterTile, Semester } from './Planner';

export interface SemesterCourseItemProps extends ComponentPropsWithoutRef<'div'> {
  courseName: string;
  isValid?: boolean;
}

/**
 * Strictly UI implementation of a semester course
 */
export const SemesterCourseItem = forwardRef<HTMLDivElement, SemesterCourseItemProps>(
  function SemesterCourseItem({ courseName, isValid, ...props }, ref) {
    return (
      <div
        ref={ref}
        {...props}
        className={`shadow-md w-full h-[22px] rounded-md py-[1px] px-[8px] flex items-center bg-white ${
          isValid ? 'border-red-500 border-[1px]' : ''
        }`}
      >
        <span className="text-[12px] font-medium text-[#1C2A6D]">{courseName}</span>
      </div>
    );
  },
);

export interface DraggableSemesterCourseItemProps {
  id: UniqueIdentifier;
  semester: Semester;
  course: Course;
  isValid: boolean;
}

/**
 * Strictly compositional wrapper around SemesterCourseItem
 */
const DraggableSemesterCourseItem: FC<DraggableSemesterCourseItemProps> = ({
  id,
  semester,
  course,
  ...props
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
      {...props}
      courseName={course.name}
    />
  );
};

export default DraggableSemesterCourseItem;
