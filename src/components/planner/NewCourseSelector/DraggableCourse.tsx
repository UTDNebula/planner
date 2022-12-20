import { Course } from '@/modules/common/data';
import { useDraggable } from '@dnd-kit/core';
import { v4 as uuid } from 'uuid';
import { DraggableCourseProps } from './CourseSelectorContainer';
import StatusTag from './StatusTag';

function Draggable({ id, children }: { id: string; children: JSX.Element }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </button>
  );
}

export default function DraggableCourse({ course }: { course: DraggableCourseProps }) {
  // Course would be marked incomplete ONLY if requirement needed course
  // Maybe DraggableCourse needs to take a prop specifying if it's needed or nah?
  // TODO: Update course status tag

  let showStatusTag = false;
  let tagType = false;

  if (course.status === 'Complete') {
    showStatusTag = true;
    tagType = true;
  } else if (course.status === 'Incomplete') {
    showStatusTag = true;
    tagType = false;
  }

  const id = uuid();
  return (
    <Draggable id={id} key={id}>
      <div
        className="bg-white text-[10px] items-center drop-shadow-sm py-1.5 px-2 flex flex-row justify-between border border-[#EDEFF7] rounded-md"
        key={id}
      >
        {course.catalogCode}
        {showStatusTag && <StatusTag status={tagType} />}
      </div>
    </Draggable>
  );
}
