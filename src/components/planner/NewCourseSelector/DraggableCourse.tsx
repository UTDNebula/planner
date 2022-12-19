import { useDraggable } from '@dnd-kit/core';
import { v4 as uuid } from 'uuid';
import StatusTag from './StatusTag';

function Draggable(props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  );
}

export default function DraggableCourse({ elm, idx }) {
  // Course would be marked incomplete ONLY if requirement needed course
  // Maybe DraggableCourse needs to take a prop specifying if it's needed or nah?
  // TODO: Update course status tag
  return (
    <Draggable id={uuid()} key={uuid()}>
      <div
        className="bg-white text-[10px] items-center drop-shadow-sm py-1.5 px-2 flex flex-row justify-between border border-[#EDEFF7] rounded-md"
        key={idx}
      >
        {elm.catalogCode}
        <StatusTag status={false} />
      </div>
    </Draggable>
  );
}
