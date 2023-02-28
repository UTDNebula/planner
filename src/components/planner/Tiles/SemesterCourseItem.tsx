import { UniqueIdentifier, useDraggable } from '@dnd-kit/core';
import React, { ComponentPropsWithoutRef, FC, forwardRef, useRef, useState } from 'react';

import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DragDataFromSemesterTile, DraggableCourse, Semester } from '../types';
import CheckIcon from '@mui/icons-material/Check';
import Checkbox from '@/components/Checkbox';
import SemesterCourseItemDropdown from './SemesterCourseItemDropdown';
import { tagColors } from '../utils';
import CourseInfoHoverCard from '../CourseInfoHoverCard';
import useGetCourseInfo from '../useGetCourseInfo';

export interface SemesterCourseItemProps extends ComponentPropsWithoutRef<'div'> {
  course: DraggableCourse;
  isSelected?: boolean;
  isDragging?: boolean;
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
      isDragging,
      onSelectCourse,
      onDeselectCourse,
      isSelected,
      onDeleteCourse,
      onColorChange,
      ...props
    },
    ref,
  ) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [hoverOpen, setHoverOpen] = useState(false);
    const openHover = () => !isDragging && !dropdownOpen && setHoverOpen(true);

    const hoverTimer = useRef<ReturnType<typeof setTimeout>>();

    const { prereqs, title } = useGetCourseInfo(course.code);

    return (
      <div
        ref={ref}
        {...props}
        data-tip="Drag!"
        className={` tooltip tooltip-left flex h-min w-full cursor-grab flex-row items-center overflow-hidden rounded-md border border-neutral-200 bg-generic-white`}
        onClick={() => setDropdownOpen(true)}
        onMouseEnter={() => {
          hoverTimer.current = setTimeout(() => openHover(), 500);
        }}
        onMouseLeave={() => {
          setHoverOpen(false);
          if (hoverTimer.current) {
            clearTimeout(hoverTimer.current);
          }
        }}
      >
        <CourseInfoHoverCard
          prereqs={prereqs}
          open={hoverOpen}
          onOpenChange={(open) => !dropdownOpen && setHoverOpen(open)}
          title={title || ''}
        >
          <div>
            <div className={`h-full w-2 transition-all ${tagColors[course.color]}`}></div>
            <div className="p-1">
              <div className="flex items-center justify-center">
                <div className="flex flex-row items-center gap-x-3">
                  <SemesterCourseItemDropdown
                    open={dropdownOpen}
                    onOpenChange={(open) => {
                      if (hoverOpen) {
                        setHoverOpen(false);
                      }
                      setDropdownOpen(open);
                    }}
                    changeColor={(color) => onColorChange && onColorChange(color)}
                    deleteCourse={() => onDeleteCourse && onDeleteCourse()}
                  >
                    <button className="cursor-pointer rounded-md py-[2px] transition-all duration-300 hover:bg-neutral-100">
                      <DragIndicatorIcon
                        fontSize="inherit"
                        className="text-[16px] text-neutral-300"
                      />
                    </button>
                  </SemesterCourseItemDropdown>

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
        </CourseInfoHoverCard>
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

  return (
    <SemesterCourseItem
      ref={setNodeRef}
      style={{
        visibility: isDragging ? 'hidden' : 'unset',
      }}
      {...attributes}
      {...listeners}
      isDragging={isDragging}
      course={course}
      onSelectCourse={onSelectCourse}
      onDeselectCourse={onDeselectCourse}
      onDeleteCourse={onDeleteCourse}
      isSelected={isSelected}
      onColorChange={onColorChange}
    />
  );
};

export default React.memo(DraggableSemesterCourseItem);
