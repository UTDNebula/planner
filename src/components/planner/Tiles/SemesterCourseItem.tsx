import { UniqueIdentifier, useDraggable } from '@dnd-kit/core';
import { ComponentPropsWithoutRef, FC, forwardRef, useState } from 'react';

import { DragDataFromSemesterTile, DraggableCourse, Semester } from '../types';
import SyncProblemIcon from '@mui/icons-material/SyncProblem';
import { displaySemesterCode } from '@/utils/utilFunctions';
import CheckIcon from '@mui/icons-material/Check';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

export interface SemesterCourseItemProps extends ComponentPropsWithoutRef<'div'> {
  course: DraggableCourse;
  isTransfer?: boolean;
  onSelectCourse?: () => void;
  onDeselectCourse?: () => void;
}

/** UI implementation of a semester course */
export const SemesterCourseItem = forwardRef<HTMLDivElement, SemesterCourseItemProps>(
  function SemesterCourseItem(
    { course, isTransfer, onSelectCourse, onDeselectCourse, ...props },
    ref,
  ) {
    // Create text output for sync icon
    const correctSemester = course.sync?.correctSemester
      ? `Course already taken in ${displaySemesterCode(course.sync?.correctSemester)}`
      : `No record of this course in Course History`;

    const [checked, setChecked] = useState(false);

    const updateChecked = () => {
      if (!checked) {
        onSelectCourse && onSelectCourse();
        setChecked(true);
      } else {
        onDeselectCourse && onDeselectCourse();
        setChecked(false);
      }
    };

    return (
      <div
        ref={ref}
        {...props}
        data-tip="Drag!"
        className={`tooltip tooltip-left flex h-[40px] w-full items-center justify-between overflow-hidden rounded-md border border-neutral-200 bg-generic-white py-4 px-5`}
      >
        <div className="flex items-center gap-x-3">
          <DragIndicatorIcon fontSize="inherit" className="text-[16px] text-neutral-300" />
          <input
            onChange={() => updateChecked()}
            type="checkbox"
            className="checkbox-primary checkbox h-5 w-5 rounded-[3.5px] border-1.25 border-neutral-300 bg-generic-white accent-primary"
          />
          <span className="text-[16px] text-[#1C2A6D]">{course.code}</span>
        </div>

        <div className="flex text-[12px] font-semibold">
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
  semester: Semester;
  course: DraggableCourse;
  onSelectCourse: () => void;
  onDeselectCourse: () => void;
}

/** Compositional wrapper around SemesterCourseItem */
const DraggableSemesterCourseItem: FC<DraggableSemesterCourseItemProps> = ({
  dragId,
  semester,
  course,
  onSelectCourse,
  onDeselectCourse,
}) => {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: dragId,
    data: { from: 'semester-tile', semester, course } as DragDataFromSemesterTile,
  });

  return (
    <SemesterCourseItem
      ref={setNodeRef}
      style={{
        visibility: isDragging ? 'hidden' : 'unset',
      }}
      {...attributes}
      {...listeners}
      course={course}
      onSelectCourse={onSelectCourse}
      onDeselectCourse={onDeselectCourse}
    />
  );
};

export default DraggableSemesterCourseItem;
