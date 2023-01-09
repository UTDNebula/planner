import { UniqueIdentifier, useDraggable } from '@dnd-kit/core';
import CloseIcon from '@mui/icons-material/Close';
import { ComponentPropsWithoutRef, FC, forwardRef } from 'react';

import { Course } from '@/modules/common/data';

import { DragDataFromSemesterTile, DraggableCourse, Semester } from '../types';

export interface SemesterCourseItemProps extends ComponentPropsWithoutRef<'div'> {
  course: DraggableCourse;
  isValid?: boolean;
  onRemove?: (course: DraggableCourse) => void;
}

/** UI implementation of a semester course */
export const SemesterCourseItem = forwardRef<HTMLDivElement, SemesterCourseItemProps>(
  function SemesterCourseItem({ course, isValid, onRemove, ...props }, ref) {
    return (
      <div
        ref={ref}
        {...props}
        className={`shadow-md w-full h-[22px] rounded-md py-[1px] px-[8px] flex items-center justify-between bg-white ${
          isValid ? 'border-red-500 border-[1px]' : ''
        }`}
      >
        <span className="text-[12px] font-medium text-[#1C2A6D]">{course.catalogCode}</span>
        <div onClick={() => onRemove && onRemove(course)}>
          <CloseIcon fontSize="small" />
        </div>
      </div>
    );
  },
);

export interface DraggableSemesterCourseItemProps {
  dragId: UniqueIdentifier;
  semester: Semester;
  course: Course;
  isValid: boolean;
  onRemove: (course: DraggableCourse) => void;
}

/** Compositional wrapper around SemesterCourseItem */
const DraggableSemesterCourseItem: FC<DraggableSemesterCourseItemProps> = ({
  dragId,
  semester,
  course,
  onRemove,
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
      course={course}
      onRemove={onRemove}
    />
  );
};

export default DraggableSemesterCourseItem;
