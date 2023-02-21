import { UniqueIdentifier, useDraggable } from '@dnd-kit/core';
import React, { ComponentPropsWithoutRef, FC, forwardRef, useState } from 'react';

import { DragDataFromSemesterTile, DraggableCourse, Semester } from '../types';
import SyncProblemIcon from '@mui/icons-material/SyncProblem';
import { displaySemesterCode } from '@/utils/utilFunctions';
import CheckIcon from '@mui/icons-material/Check';
import Checkbox from '@/components/Checkbox';
import SemesterCourseItemDropdown from './SemesterCourseItemDropdown';
import { useSemestersContext } from '../SemesterContext';

export interface SemesterCourseItemProps extends ComponentPropsWithoutRef<'div'> {
  course: DraggableCourse;
  isSelected?: boolean;
  isTransfer?: boolean;
  onSelectCourse?: () => void;
  onDeselectCourse?: () => void;
  onDeleteCourse?: () => void;
}

/** UI implementation of a semester course */
/* eslint-disable react/prop-types */
export const MemoizedSemesterCourseItem = React.memo(
  forwardRef<HTMLDivElement, SemesterCourseItemProps>(function SemesterCourseItem(
    { course, isTransfer, onSelectCourse, onDeselectCourse, isSelected, onDeleteCourse, ...props },
    ref,
  ) {
    // Create text output for sync icon
    const correctSemester = course.sync?.correctSemester
      ? `Course already taken in ${displaySemesterCode(course.sync?.correctSemester)}`
      : `No record of this course in Course History`;

    return (
      <div
        ref={ref}
        {...props}
        data-tip="Drag!"
        className={`tooltip tooltip-left flex h-[40px] w-full cursor-grab items-center justify-between overflow-hidden rounded-md border border-neutral-200 bg-generic-white py-4 px-5`}
      >
        <div className="flex items-center gap-x-3">
          <SemesterCourseItemDropdown deleteCourse={() => onDeleteCourse && onDeleteCourse()} />
          <Checkbox
            style={{ width: '20px', height: '20px' }}
            checked={isSelected}
            onCheckedChange={(checked) => {
              if (checked && onSelectCourse) {
                onSelectCourse();
              }

              if (!checked && onDeselectCourse) {
                onDeselectCourse();
              }
            }}
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
  }),
);

export const SemesterCourseItem = MemoizedSemesterCourseItem;

export interface DraggableSemesterCourseItemProps {
  dragId: UniqueIdentifier;
  isSelected: boolean;
  semester: Semester;
  course: DraggableCourse;
  onSelectCourse: () => void;
  onDeselectCourse: () => void;
  onDeleteCourse: () => void;
}

/** Compositional wrapper around SemesterCourseItem */
const DraggableSemesterCourseItem: FC<DraggableSemesterCourseItemProps> = ({
  dragId,
  semester,
  course,
  onSelectCourse,
  onDeselectCourse,
  onDeleteCourse,
  isSelected,
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
      onDeleteCourse={onDeleteCourse}
      isSelected={isSelected}
    />
  );
};

export default React.memo(DraggableSemesterCourseItem);
