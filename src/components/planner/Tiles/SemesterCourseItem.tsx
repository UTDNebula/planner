import { UniqueIdentifier, useDraggable } from '@dnd-kit/core';
import React, { ComponentPropsWithoutRef, FC, forwardRef, useState } from 'react';

import { DragDataFromSemesterTile, DraggableCourse, Semester } from '../types';
import CheckIcon from '@mui/icons-material/Check';
import Checkbox from '@/components/Checkbox';
import SemesterCourseItemDropdown from './SemesterCourseItemDropdown';
import { tagColors } from '../utils';
import { useSemestersContext } from '../SemesterContext';
import { trpc } from '@/utils/trpc';

export interface SemesterCourseItemProps extends ComponentPropsWithoutRef<'div'> {
  course: DraggableCourse;
  isSelected?: boolean;
  isValid?: boolean;
  onSelectCourse?: () => void;
  onDeselectCourse?: () => void;
  onDeleteCourse?: () => void;
  onColorChange?: (color: keyof typeof tagColors) => void;
}

/** UI implementation of a semester course */
/* eslint-disable react/prop-types */
export const MemoizedSemesterCourseItem = React.memo(
  forwardRef<HTMLDivElement, SemesterCourseItemProps>(function SemesterCourseItem(
    {
      course,
      onSelectCourse,
      onDeselectCourse,
      isSelected,
      onDeleteCourse,
      onColorChange,
      isValid,
      ...props
    },
    ref,
  ) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
      <div
        ref={ref}
        {...props}
        data-tip="Drag!"
        className={`${
          isValid ? 'border-black' : 'border-red-700'
        } tooltip tooltip-left flex h-min w-full cursor-grab flex-row items-center overflow-hidden rounded-md border bg-generic-white`}
        onClick={() => setDropdownOpen((prev) => !prev)}
      >
        <div className={`h-full w-2 transition-all ${tagColors[course.color]}`}></div>
        <div className="p-1">
          <div className="flex items-center justify-center">
            <div className="flex flex-row items-center gap-x-3">
              <SemesterCourseItemDropdown
                open={dropdownOpen}
                onOpenChange={(open) => setDropdownOpen(open)}
                changeColor={(color) => onColorChange && onColorChange(color)}
                deleteCourse={() => onDeleteCourse && onDeleteCourse()}
              />
              <Checkbox
                style={{ width: '20px', height: '20px' }}
                checked={isSelected}
                onClick={(e) => e.stopPropagation()}
                onCheckedChange={(checked) => {
                  if (checked && onSelectCourse) {
                    onSelectCourse();
                  }

                  if (!checked && onDeselectCourse) {
                    onDeselectCourse();
                  }
                }}
              />
              <span className="text-sm text-[#1C2A6D]">{course.code}</span>
            </div>
          </div>
          <div className="ml-auto flex text-xs font-semibold">
            {course.taken && (
              <span className=" tooltip text-[#22C55E]" data-tip="Completed">
                <CheckIcon fontSize="small" />
              </span>
            )}
          </div>
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
  onColorChange: (color: keyof typeof tagColors) => void;
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
  onColorChange,
}) => {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: dragId,
    data: { from: 'semester-tile', semester, course } as DragDataFromSemesterTile,
  });

  const { planId } = useSemestersContext();
  const prereqData = trpc.validator.prereqValidator.useQuery(planId);
  const isValid = prereqData.data?.prereqValidation.get(course.code)?.[0];
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
      onColorChange={onColorChange}
      isValid={isValid || false}
    />
  );
};

export default React.memo(DraggableSemesterCourseItem);
