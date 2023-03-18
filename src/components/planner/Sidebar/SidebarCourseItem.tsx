import { UniqueIdentifier, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

import { DragDataFromCourseList, DraggableCourse } from '../types';

import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import CheckIcon from '@mui/icons-material/Check';
import { getSemesterHourFromCourseCode } from '@/utils/utilFunctions';
import React, { ComponentPropsWithoutRef, forwardRef, useState, useRef, useEffect } from 'react';
import CourseInfoHoverCard from '../CourseInfoHoverCard';
import useGetCourseInfo from '../useGetCourseInfo';

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

    const { prereqs, title } = useGetCourseInfo(course.code);

    return (
      <div
        ref={ref}
        {...props}
        className={`cursor-grab ${
          course.taken && 'opacity-50'
        } flex h-[40px] flex-row items-center justify-between rounded-md border border-neutral-300 bg-white py-3 px-5 text-[10px] text-[#1C2A6D] drop-shadow-sm`}
        onMouseEnter={() => {
          hoverTimer.current = setTimeout(() => setHoverOpen(true), 500);
        }}
        onMouseLeave={() => {
          setHoverOpen(false);
          clearTimeout(hoverTimer.current);
        }}
      >
        <CourseInfoHoverCard
          prereqs={prereqs}
          open={hoverOpen && !isDragging}
          onOpenChange={(open) => setHoverOpen(open)}
          side="left"
          title={title || ''}
        >
          <div className="flex w-full flex-row justify-between">
            <span className="text-sm text-[#1C2A6D]">
              <DragIndicatorIcon fontSize="inherit" className="mr-3 text-[16px] text-[#D4D4D4]" />
              {course.code}
            </span>
            <div className="">
              {course.hours && course.hours < getSemesterHourFromCourseCode(course.code)! && (
                <div>{course.hours}</div>
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
