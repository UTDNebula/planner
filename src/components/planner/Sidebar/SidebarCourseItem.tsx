import { UniqueIdentifier, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

import { DragDataFromCourseList, DraggableCourse } from '../types';

import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import CheckIcon from '@mui/icons-material/Check';
import { emptyFunction, getSemesterHourFromCourseCode } from '@/utils/utilFunctions';
import React, { ComponentPropsWithoutRef, forwardRef, useState, useRef, useEffect } from 'react';
import CourseInfoHoverCard from '../CourseInfoHoverCard';
import useGetCourseInfo from '../useGetCourseInfo';
import { useSemestersContext } from '../SemesterContext';

interface SidebarCourseItemProps extends ComponentPropsWithoutRef<'div'> {
  course: DraggableCourse;
  isDragging?: boolean;
}
/** UI Implementation of sidebar course */
/* eslint-disable react/prop-types */
export const SidebarCourseItem = React.memo(
  forwardRef<HTMLDivElement, SidebarCourseItemProps>(function SidebarCourseItem(
    { course, isDragging, ...props },
    ref,
  ) {
    // Course would be marked incomplete ONLY if requirement needed course
    // Maybe DraggableCourse needs to take a prop specifying if it's needed or nah?
    // TODO: Update course status tag
    const [hoverOpen, setHoverOpen] = useState(false);
    const hoverTimer = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
      if (isDragging) clearTimeout(hoverTimer.current);
    }, [isDragging]);

    const { title, description } = useGetCourseInfo(course.code);
    const { allSemesters } = useSemestersContext();
    let year = allSemesters[0]['code']['year'];
    if (allSemesters[0]['code']['semester'] !== 'f') year--;

    return (
      <div
        ref={ref}
        {...props}
        className={`cursor-grab ${
          course.taken && 'opacity-50'
        } flex h-[40px] flex-row items-center justify-between rounded-md border border-neutral-300 bg-white py-3 px-5 text-[10px] text-[#1C2A6D] drop-shadow-sm`}
        onMouseEnter={() => {
          clearTimeout(hoverTimer.current);
          hoverTimer.current = setTimeout(() => setHoverOpen(true), 500);
        }}
        onMouseLeave={() => {
          clearTimeout(hoverTimer.current);
          hoverTimer.current = setTimeout(() => setHoverOpen(false), 800);
        }}
      >
        <CourseInfoHoverCard
          description={description ?? ''}
          // prereqs={[prereqs, coreqs, co_or_pre]}
          open={hoverOpen && !isDragging}
          onOpenChange={emptyFunction}
          side="left"
          title={title || ''}
          courseCode={course.code}
          year={year}
        >
          <div className="flex w-full flex-row items-center justify-between">
            <span className="flex w-full flex-row items-center overflow-hidden text-sm text-[#1C2A6D]">
              <DragIndicatorIcon fontSize="inherit" className="mr-3 text-[16px] text-[#D4D4D4]" />
              <div className="mr-4 w-full overflow-hidden text-ellipsis whitespace-nowrap">
                {course.code} - {course.title}
              </div>
            </span>
            <div className="flex flex-row items-center gap-x-2">
              {course.hours && course.hours < getSemesterHourFromCourseCode(course.code)! && (
                <div>{course.hours} hours </div>
              )}
              {course.status === 'complete' && <CheckIcon fontSize="small" />}
            </div>
          </div>
        </CourseInfoHoverCard>
      </div>
    );
  }),
);

export default function DraggableSidebarCourseItem({
  dragId,
  course,
}: {
  dragId: UniqueIdentifier;
  course: DraggableCourse;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: dragId,
    data: { from: 'course-list', course } as DragDataFromCourseList,
  });

  return (
    <SidebarCourseItem
      ref={setNodeRef}
      course={course}
      style={{ transform: CSS.Translate.toString(transform) }}
      isDragging={isDragging}
      {...listeners}
      {...attributes}
    />
  );
}
