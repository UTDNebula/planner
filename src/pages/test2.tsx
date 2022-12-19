import { DndContext, DragOverlay, rectIntersection, UniqueIdentifier } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { NextPage } from 'next';
import { FC, useState } from 'react';

interface SortableItemProps {
  id: UniqueIdentifier;
}
const SortableItem: FC<SortableItemProps> = ({ id }) => {
  const {
    active,
    attributes,
    isDragging,
    isSorting,
    listeners,
    overIndex,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  if (active) {
    console.log(CSS.Transform.toString(transform));
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div className="bg-slate-200" ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {id}
    </div>
  );
};

interface DroppableContainerProps {
  id: UniqueIdentifier;
  items: UniqueIdentifier[];
}
const DroppableContainer: FC<DroppableContainerProps> = ({ id, items, children }) => {
  return <div className="m-10">{children}</div>;
};

const Test2Page: NextPage = () => {
  const [containers, setContainers] = useState<
    { id: UniqueIdentifier; items: UniqueIdentifier[] }[]
  >([
    { id: 'container-1', items: [1, 2, 3, 4, 5] },
    { id: 'container-2', items: ['A', 'B', 'C', 'D'] },
  ]);

  const [activeId, setActiveId] = useState<UniqueIdentifier>(null);

  console.log({ items: containers });
  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragStart={({ active }) => {
        setActiveId(active.id);
      }}
      onDragEnd={({ active }) => {
        setActiveId(null);
      }}
      onDragOver={({ active, over }) => {
        if (active && over && active.id !== over.id) {
          console.log({ active, over });
        }
      }}
    >
      <div className="w-full inline-grid grid-flow-row">
        {containers.map(({ items, id }) => (
          <DroppableContainer key={id} id={id} items={items}>
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
              <div className="bg-slate-100">
                {items.map((item) => (
                  <SortableItem key={item} id={item} />
                ))}
              </div>
            </SortableContext>
          </DroppableContainer>
        ))}
      </div>
      <DragOverlay>{activeId && <div className="bg-slate-200">{activeId}</div>}</DragOverlay>
    </DndContext>
  );
};

export default Test2Page;
