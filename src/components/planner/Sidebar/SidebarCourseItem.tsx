import { UniqueIdentifier, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

import { DragDataFromCourseList, DraggableCourse } from '../types';
import StatusTag from './StatusTag';

/** UI Implementation of sidebar course */
export function SidebarCourseItem({ course }: { course: DraggableCourse }): JSX.Element {
  // Course would be marked incomplete ONLY if requirement needed course
  // Maybe DraggableCourse needs to take a prop specifying if it's needed or nah?
  // TODO: Update course status tag
  return (
    <div className="text-[#1C2A6D] bg-white text-[10px] items-center drop-shadow-sm py-1.5 px-2 flex flex-row justify-between border border-[#EDEFF7] rounded-md">
      {course.catalogCode}
      {typeof course.status !== 'undefined' && <StatusTag status={course.status === 'complete'} />}
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
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: dragId,
    data: { from: 'course-list', course } as DragDataFromCourseList,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      {...listeners}
      {...attributes}
    >
      <SidebarCourseItem course={course} />
    </div>
  );
}
