import { UniqueIdentifier, useDraggable } from '@dnd-kit/core';
import React, { ComponentPropsWithoutRef, FC, forwardRef, useRef, useState } from 'react';

import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DragDataFromSemesterTile, DraggableCourse, Semester } from '../types';
import LockIcon from '@/icons/LockIcon';
import Checkbox from '@/components/Checkbox';
import SemesterCourseItemDropdown from './SemesterCourseItemDropdown';
import { tagColors } from '../utils';
import { useSemestersContext } from '../SemesterContext';
import { trpc } from '@/utils/trpc';
import CourseInfoHoverCard from '../CourseInfoHoverCard';
import useGetCourseInfo from '../useGetCourseInfo';
import WarningIcon from '@/icons/WarningIcon';
import PrereqWarnHoverCard from '../PrereqWarnHoverCard';

export interface SemesterCourseItemProps extends ComponentPropsWithoutRef<'div'> {
  course: DraggableCourse;
  semesterLocked?: boolean;
  isSelected?: boolean;
  isValid?: boolean;
  isDragging?: boolean;
  onSelectCourse?: () => void;
  onDeselectCourse?: () => void;
  onDeleteCourse?: () => void;
  onColorChange?: (color: keyof typeof tagColors) => void;
  onLockChange?: (lock: boolean) => void;
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
      isValid,
      onLockChange,
      semesterLocked,
      ...props
    },
    ref,
  ) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [hoverOpen, setHoverOpen] = useState(false);
    const [hoverIconOpen, setHoverIconOpen] = useState(false);
    const openHover = () => !isDragging && !dropdownOpen && setHoverOpen(true);

    const hoverTimer = useRef<ReturnType<typeof setTimeout>>();

    const { prereqs, title } = useGetCourseInfo(course.code);

    return (
      <div
        ref={ref}
        {...props}
        className={`flex h-[50px] w-full cursor-grab flex-row items-center rounded-md border  border-[#D4D4D4] bg-[#FFFFFF] ${
          !course.locked || isValid || isValid === undefined
            ? course.locked
              ? 'bg-neutral-200'
              : 'bg-inherit'
            : 'bg-[#FFFBEB]'
        } ${semesterLocked || course.locked ? 'text-neutral-400' : 'text-[#1C2A6D]'}`}
        // onClick={() => setDropdownOpen((prev) => !prev)}
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
        <div className="h-[50px] w-2">
          {course.color && (
            <div
              className={`h-full w-full rounded-l-md transition-all ${tagColors[course.color]} `}
            ></div>
          )}
        </div>

        <CourseInfoHoverCard
          prereqs={prereqs}
          open={hoverOpen}
          onOpenChange={(open) => !dropdownOpen && setHoverOpen(open)}
          title={title || ''}
        >
          <div className="flex w-full flex-row items-center gap-x-3">
            <SemesterCourseItemDropdown
              open={dropdownOpen}
              onOpenChange={(open) => {
                if (hoverOpen) {
                  setHoverOpen(false);
                }
                setDropdownOpen(open);
              }}
              locked={course.locked}
              semesterLocked={semesterLocked || false}
              toggleLock={() => onLockChange && onLockChange(!course.locked)}
              changeColor={(color) => onColorChange && onColorChange(color)}
              deleteCourse={() => onDeleteCourse && onDeleteCourse()}
            >
              <button className="cursor-pointer rounded-md py-[2px] transition-all duration-300 hover:bg-neutral-100">
                <DragIndicatorIcon fontSize="inherit" className="text-[16px] text-neutral-300" />
              </button>
            </SemesterCourseItemDropdown>

            <Checkbox
              disabled={course.locked}
              style={{ width: '20px', height: '20px', backgroundColor: 'inherit' }}
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
            <span className="text-sm">{course.code}</span>
            <div className="ml-auto mr-2 flex items-center justify-center gap-2 align-middle text-xs font-semibold">
              {!isValid && (
                <PrereqWarnHoverCard
                  prereqs={prereqs}
                  open={hoverIconOpen}
                  onOpenChange={(hoverOpen) => !dropdownOpen && setHoverIconOpen(hoverOpen)}
                >
                  <span
                    className="text-[#22C55E]"
                    onMouseEnter={() => {
                      setHoverIconOpen(true);
                    }}
                    onMouseLeave={() => {
                      setHoverIconOpen(false);
                    }}
                  >
                    <WarningIcon />
                  </span>
                </PrereqWarnHoverCard>
              )}
              {course.locked && <LockIcon />}
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
  onLockChange: (lock: boolean) => void;
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
  onLockChange,
}) => {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: dragId,
    data: { from: 'semester-tile', semester, course } as DragDataFromSemesterTile,
    disabled: course.locked || semester.locked,
  });

  const { planId } = useSemestersContext();
  const prereqData = trpc.validator.prereqValidator.useQuery(planId);
  const isValid = prereqData.data?.prereqValidation.get(course.code)?.[0];
  return (
    <SemesterCourseItem
      onLockChange={onLockChange}
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
      semesterLocked={semester.locked}
      onColorChange={onColorChange}
      isValid={isValid || isValid === undefined} // Show as valid if isValid is undefined
    />
  );
};

export default React.memo(DraggableSemesterCourseItem);
