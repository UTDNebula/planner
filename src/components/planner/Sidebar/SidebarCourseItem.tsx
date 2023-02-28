import { UniqueIdentifier, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

import { DragDataFromCourseList, DraggableCourse } from '../types';

import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import CheckIcon from '@mui/icons-material/Check';
import { getSemesterHourFromCourseCode } from '@/utils/utilFunctions';
import { useState } from 'react';
import { trpc } from '@/utils/trpc';
import { Popover, Typography } from '@mui/material';

/** UI Implementation of sidebar course */
export function SidebarCourseItem({ course }: { course: DraggableCourse }): JSX.Element {
  // Course would be marked incomplete ONLY if requirement needed course
  // Maybe DraggableCourse needs to take a prop specifying if it's needed or nah?
  // TODO: Update course status tag
  return (
    <div
      className={`cursor-grab ${
        course.taken && 'opacity-50'
      } flex h-[40px] flex-row items-center justify-between rounded-md border border-neutral-300 bg-white py-3 px-5 text-[10px] text-[#1C2A6D] drop-shadow-sm`}
    >
      <span className="text-sm text-[#1C2A6D]">
        <DragIndicatorIcon fontSize="inherit" className="mr-3 text-[16px] text-[#D4D4D4]" />
        {course.code}
      </span>
      {course.hours && course.hours < getSemesterHourFromCourseCode(course.code)! && (
        <div>{course.hours}</div>
      )}
      {course.status === 'complete' && <CheckIcon fontSize="small" />}
    </div>
  );
}

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

  const [finalPrereqs, setFinalprereqs] = useState<string[]>();
  let prereqs: string[] = [];
  const [title, setTitle] = useState<string>('');

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    data?.find(function (cNum) {
      if (cNum.subject_prefix + ' ' + cNum.course_number === course.code) {
        setTitle(cNum.title);
        (cNum.prerequisites as Record<string, any>).options.map((elem: any) => {
          if (elem.type !== 'course' && elem.type !== 'other') {
            elem.options.map((elem2: any) => {
              if (elem2.type !== 'course' && elem2.type !== 'other') {
                elem2.options.map((elem3: any) => {
                  data?.map((elem4) => {
                    if (elem4.id === elem3.class_reference) {
                      prereqs.push(elem4.subject_prefix + ' ' + elem4.course_number);
                    }
                  });
                });
              } else if (elem2.type === 'other') {
                prereqs.push(elem2.description);
              } else {
                data?.map((elem4) => {
                  if (elem4.id === elem2.class_reference) {
                    prereqs.push(elem4.subject_prefix + ' ' + elem4.course_number);
                  }
                });
              }
            });
          } else if (elem.type === 'other') {
            prereqs.push(elem.description);
          } else {
            data?.map((elem4) => {
              if (elem4.id === elem.class_reference) {
                prereqs.push(elem4.subject_prefix + ' ' + elem4.course_number);
              }
            });
          }
        });
        return course.code;
      }
    });

    setFinalprereqs(prereqs.map((val) => val));
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    prereqs = [];
  };

  const q = trpc.courses.publicGetAllCourses.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const { data } = q;

  const open = Boolean(anchorEl);

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      {...listeners}
      {...attributes}
      onMouseOver={handlePopoverOpen}
      onMouseLeave={handlePopoverClose}
    >
      {anchorEl && !isDragging && (
        <div>
          <Popover
            id="mouse-over-popover"
            sx={{
              pointerEvents: 'none',
              width: 'full',
              whiteSpace: 'normal',
              height: 'full',
            }}
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <div className="p-4">
              <Typography sx={{ px: 5, pt: 1, maxWidth: '400px', fontSize: '18px' }}>
                {title}
              </Typography>
              <Typography sx={{ px: 5, pb: 1, maxWidth: '400px', fontSize: '12px' }}>
                {finalPrereqs && finalPrereqs.length > 0
                  ? `Prerequisites: ${finalPrereqs.map((elem, idx) => elem).join(', ')}`
                  : 'Prerequisites: None'}
              </Typography>
            </div>
          </Popover>
        </div>
      )}
      <SidebarCourseItem course={course} />
    </div>
  );
}
