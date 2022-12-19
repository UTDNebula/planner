import { useDraggable } from '@dnd-kit/core';
import { v4 as uuid } from 'uuid';

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

export default function DraggableCourse({ idx, elm }) {
  return (
    <Draggable id={uuid()} key={uuid()}>
      <div
        className="bg-white text-[10px] items-center drop-shadow-sm py-1.5 px-2 flex flex-row justify-between border border-[#EDEFF7] rounded-md"
        key={idx}
      >
        {elm}
        <div className="flex justify-center items-center text-[11px] w-20 border text-red-500 border-red-500 rounded-md">
          Incomplete
        </div>
      </div>
    </Draggable>
  );
}
