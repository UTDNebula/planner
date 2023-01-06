import { Course } from '@/modules/common/data';
import { UniqueIdentifier, useDraggable } from '@dnd-kit/core';
import { ComponentPropsWithoutRef, FC, forwardRef } from 'react';

import { DragDataFromSemesterTile, Semester } from '../types';

export interface SemesterCourseItemProps extends ComponentPropsWithoutRef<'div'> {
  courseName: string;
  isValid?: boolean;
}

/** UI implementation of a semester course */
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
  dragId: UniqueIdentifier;
  semester: Semester;
  course: Course;
  isValid: boolean;
}

/** Compositional wrapper around SemesterCourseItem */
const DraggableSemesterCourseItem: FC<DraggableSemesterCourseItemProps> = ({
  dragId,
  semester,
  course,
  ...props
}) => {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: dragId,
    data: { from: 'semester-tile', semester, course } as DragDataFromSemesterTile,
  });

  return (
    <SemesterCourseItem
      ref={setNodeRef}
      style={{ visibility: isDragging ? 'hidden' : 'unset' }}
      {...attributes}
      {...listeners}
      {...props}
      courseName={course.catalogCode}
    />
  );
};

export default DraggableSemesterCourseItem;