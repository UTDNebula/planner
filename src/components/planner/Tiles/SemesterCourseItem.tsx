import { UniqueIdentifier } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { ComponentPropsWithoutRef, FC, forwardRef } from 'react';

import { DragDataFromSemesterTile, PlanCourse, PlanSemester } from '../types';
import SyncProblemIcon from '@mui/icons-material/SyncProblem';
import { displaySemesterCode } from '@/utils/utilFunctions';
import CheckIcon from '@mui/icons-material/Check';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useSortable } from '@dnd-kit/sortable';

export interface SemesterCourseItemProps extends ComponentPropsWithoutRef<'div'> {
  course: PlanCourse;
  isValid?: boolean;
  isTransfer?: boolean;
  onRemove?: (course: PlanCourse) => void;
}

/** UI implementation of a semester course */
export const SemesterCourseItem = forwardRef<HTMLDivElement, SemesterCourseItemProps>(
  function SemesterCourseItem({ course, isValid, isTransfer, onRemove, ...props }, ref) {
    // Create text output for sync icon
    const correctSemester = course.sync?.correctSemester
      ? `Course already taken in ${displaySemesterCode(course.sync?.correctSemester)}`
      : `No record of this course in Course History`;

    return (
      <div
        ref={ref}
        {...props}
        data-tip="delete here"
        className={`tooltip tooltip-left flex h-[40px] w-full flex-row items-center justify-between rounded-md py-[1px] px-[8px] shadow-md  ${
          isValid ? 'border-[1px] border-red-500' : ''
        }`}
      >
        <span className="text-[16px] text-[#1C2A6D]">
          <DragIndicatorIcon fontSize="inherit" className="mr-3 text-[16px] text-[#D4D4D4]" />
          {course.code}
        </span>

        <div className="flex  text-[12px] font-semibold">
          {course.taken && (
            <span className=" tooltip text-[#22C55E]" data-tip="Completed">
              <CheckIcon fontSize="small" />
            </span>
          )}
          {course.transfer && (
            <span className="tooltip text-green-500" data-tip="Transfer">
              T
            </span>
          )}
          {!course.sync?.isSynced && (
            <div className="tooltip" data-tip={`${correctSemester}`}>
              <SyncProblemIcon fontSize="small" />
            </div>
          )}
        </div>
      </div>
    );
  },
);

export interface DraggableSemesterCourseItemProps {
  dragId: UniqueIdentifier;
  semester: PlanSemester;
  course: PlanCourse;
  isValid: boolean;
  onRemove: (course: PlanCourse) => void;
}

/** Compositional wrapper around SemesterCourseItem */
const DraggableSemesterCourseItem: FC<DraggableSemesterCourseItemProps> = ({
  dragId,
  semester,
  course,
  onRemove,
}) => {
  const { setNodeRef, attributes, listeners, isDragging, transition, transform } = useSortable({
    id: dragId,
    data: { from: 'semester-tile', semester, course } as DragDataFromSemesterTile,
  });

  return (
    <SemesterCourseItem
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        visibility: isDragging ? 'hidden' : 'unset',
      }}
      {...attributes}
      {...listeners}
      course={course}
      onRemove={onRemove}
    />
  );
};

export default DraggableSemesterCourseItem;
