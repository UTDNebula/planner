import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import CourseCard from './CourseCard';

/**
 * Component properties for a {@link DraggableCourseCard}.
 */
export interface DraggableCourseCardProps {
  id: string;
  code: string;
  title: string;
  description: string;
  index: number;
}

/**
 * A draggable card showing course details.
 */
export default function DraggableCourseCard(props: DraggableCourseCardProps) {
  const { id, code, title, description, index } = props;
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div ref={provided.innerRef}>
          <CourseCard
            code={code}
            title={title}
            description={description}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          />
        </div>
      )}
    </Draggable >
  );
}