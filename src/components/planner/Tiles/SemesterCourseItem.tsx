import { UniqueIdentifier, useDraggable } from '@dnd-kit/core';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import React, { ComponentPropsWithoutRef, FC, forwardRef, useState, useRef } from 'react';
import Skeleton from 'react-loading-skeleton';

import Checkbox from '@/components/Checkbox';
import DotsHorizontalIcon from '@/icons/DotsHorizontalIcon';
import FilledWarningIcon from '@/icons/FilledWarningIcon';
import LockIcon from '@/icons/LockIcon';
import { trpc } from '@/utils/trpc';

import SemesterCourseItemDropdown from './SemesterCourseItemDropdown';
import CourseInfoHoverCard from '../CourseInfoHoverCard';
import PrereqWarnHoverCard from '../PrereqWarnHoverCard';
import { useSemestersContext } from '../SemesterContext';
import { DragDataFromSemesterTile, DraggableCourse, Semester } from '../types';
import useGetCourseInfo from '../useGetCourseInfo';
import { tagColors } from '../utils';

import 'react-loading-skeleton/dist/skeleton.css';

export interface SemesterCourseItemProps extends ComponentPropsWithoutRef<'div'> {
  course: DraggableCourse;
  semesterLocked?: boolean;
  isSelected?: boolean;
  isValid: boolean;
  requirementsData?: [Array<string>, Array<string>, Array<string>];
  isDragging?: boolean;
  onSelectCourse?: () => void;
  onDeselectCourse?: () => void;
  onDeleteCourse?: () => void;
  onColorChange?: (color: keyof typeof tagColors) => void;
  onLockChange?: (lock: boolean) => void;
  onPrereqOverrideChange?: (override: boolean) => void;
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
      requirementsData,
      onLockChange,
      onPrereqOverrideChange,
      semesterLocked,
      ...props
    },
    ref,
  ) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [hoverOpen, setHoverOpen] = useState(false);
    const [hoverEllipse, setHoverEllipse] = useState(false);
    const [prereqWarnOpen, setPrereqWarnOpen] = useState(false);

    const hoverTimer = useRef<ReturnType<typeof setTimeout>>();

    const { title, description } = useGetCourseInfo(course.code);
    const { allSemesters } = useSemestersContext();
    let year = allSemesters[0]['code']['year'];
    if (allSemesters[0]['code']['semester'] !== 'f') year--;

    return (
      <div
        ref={ref}
        {...props}
        className={`flex h-[58px] w-full cursor-grab flex-row items-center rounded-md border border-[#D4D4D4] ${
          !isValid && !course.prereqOveridden ? 'bg-[#FEFBED]' : 'bg-[#FFFFFF]'
        }  ${
          !course.locked || isValid || isValid === undefined
            ? course.locked || semesterLocked
              ? 'cursor-default bg-neutral-200'
              : 'bg-inherit'
            : 'cursor-default bg-neutral-200'
        } ${semesterLocked || course.locked ? 'text-neutral-400' : 'text-[#1C2A6D]'} ${
          !isValid && '-order-1'
        }`}
        onClick={() => {
          // Don't open if user is hovering over course info
          if (!course.locked && !semesterLocked) setDropdownOpen(true);
        }}
        onMouseEnter={() => {
          if (!dropdownOpen && !course.locked && !semesterLocked)
            hoverTimer.current = setTimeout(() => setHoverOpen(true), 500);
          setHoverEllipse(true);
        }}
        onMouseLeave={() => {
          setHoverEllipse(false);
          setHoverOpen(false);
          setPrereqWarnOpen(false);
          clearTimeout(hoverTimer.current);
        }}
      >
        <div className="h-[50px] min-w-[0.5rem]">
          {course.color && (
            <div
              className={`h-full w-full rounded-l-md transition-all ${tagColors[course.color]} `}
            ></div>
          )}
        </div>
        <CourseInfoHoverCard
          description={description ?? ''}
          open={Boolean(title) && hoverOpen && !isDragging && !prereqWarnOpen}
          side="top"
          title={title || ''}
          courseCode={course.code}
          year={year}
        >
          <div className="flex w-full flex-row items-center gap-x-3">
            <DragIndicatorIcon fontSize="inherit" className="text-[16px] text-neutral-300" />
            {course.locked || semesterLocked ? (
              <LockIcon className="ml-1" />
            ) : (
              <Checkbox
                disabled={course.locked}
                style={{ minWidth: '20px', height: '20px', backgroundColor: 'inherit' }}
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
            )}
            <div className="flex w-[calc(100%-8rem)] flex-col">
              <span className="content-middle flex items-center whitespace-nowrap text-sm">
                {course.code}
                {!isValid && !course.prereqOveridden && !course.locked && (
                  <PrereqWarnHoverCard
                    prereqs={requirementsData === undefined ? [[], [], []] : requirementsData}
                    description={description ?? ''}
                    open={prereqWarnOpen}
                    onOpenChange={(hoverOpen) => setPrereqWarnOpen(hoverOpen)}
                    title={title || ''}
                    isOverriden={course.prereqOveridden}
                  >
                    <span className="text-[#FBBF24]" onMouseLeave={() => setPrereqWarnOpen(false)}>
                      {!semesterLocked && <FilledWarningIcon />}
                    </span>
                  </PrereqWarnHoverCard>
                )}
              </span>
              <span className="truncate text-sm">
                {title || (course.code[0] == '0' ? '' : <Skeleton />)}
              </span>
            </div>
            {!semesterLocked && (
              <SemesterCourseItemDropdown
                open={dropdownOpen}
                onOpenChange={(open) => {
                  if (hoverOpen) {
                    setHoverOpen(false);
                  }
                  if (!open) setHoverEllipse(false);
                  setDropdownOpen(open);
                }}
                locked={course.locked}
                onPrereqOverrideChange={() =>
                  onPrereqOverrideChange && onPrereqOverrideChange(!course.prereqOveridden)
                }
                isValid={isValid}
                prereqOverriden={course.prereqOveridden}
                semesterLocked={semesterLocked || false}
                toggleLock={() => onLockChange && onLockChange(!course.locked)}
                changeColor={(color) => onColorChange && onColorChange(color)}
                deleteCourse={() => onDeleteCourse && onDeleteCourse()}
              >
                <div
                  className={`mr-2 rounded-md px-2 py-3 hover:cursor-default ${
                    course.locked ? 'hover:bg-gray-300' : 'hover:bg-gray-200/[.5]'
                  }`}
                  onClick={() => setDropdownOpen(true)}
                >
                  {!semesterLocked && (
                    <DotsHorizontalIcon
                      className={`h-auto w-5 ${hoverEllipse || dropdownOpen ? '' : 'invisible'}`}
                    />
                  )}
                </div>
              </SemesterCourseItemDropdown>
            )}
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
  onPrereqOverrideChange: (override: boolean) => void;
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
  onPrereqOverrideChange,
}) => {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: dragId,
    data: { from: 'semester-tile', semester, course } as DragDataFromSemesterTile,
    disabled: course.locked || semester.locked,
  });

  const { planId } = useSemestersContext();
  const requirementsData = trpc.validator.prereqValidator.useQuery(planId, {});

  const isValid: [boolean, boolean, boolean] = [true, true, true];
  const hoverList: [Array<string>, Array<string>, Array<string>] = [[], [], []];
  const prereqData = requirementsData.data?.prereq?.get(course.code);
  const coreqData = requirementsData.data?.coreq?.get(course.code);
  const coorpreData = requirementsData.data?.coorpre?.get(course.code);
  if (coreqData) {
    isValid[1] = coreqData.length > 0 ? false : true;
    coreqData.map((data) => {
      const tmp = data[0].join(', ');
      hoverList[1].push(tmp.concat(' (', data[1].toString(), ' required)'));
    });
  }
  if (prereqData) {
    isValid[0] = prereqData.length > 0 ? false : true;
    prereqData.map((data) => {
      const tmp = data[0].join(', ');
      hoverList[0].push(tmp.concat(' (', data[1].toString(), ' required)'));
    });
  }

  if (coorpreData) {
    isValid[2] = coorpreData.length > 0 ? false : true;
    coorpreData.map((data) => {
      const tmp = data[0].join(', ');
      hoverList[2].push(tmp.concat(' (', data[1].toString(), ' required)'));
    });
  }

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
      isValid={isValid[0] && isValid[1] && isValid[2]} // Show as valid if isValid is undefined
      requirementsData={hoverList}
      onPrereqOverrideChange={onPrereqOverrideChange}
    />
  );
};

export default React.memo(DraggableSemesterCourseItem);
