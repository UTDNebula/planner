import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import CourseCard, { CourseCardProps } from './CourseCard';

/**
 * Component properties for a {@link DraggableCourseCard}.
 */
export interface DraggableCourseCardProps extends CourseCardProps {
  id: string;
  index: number;
}

/**
 * A draggable card showing course details.
 */
export default function DraggableCourseCard(props: DraggableCourseCardProps) {
  const { id, code, title, description, index, showOptions } = props;
  return (
    <Draggable
      key={id}
      draggableId={id}
      index={index}
      isDragDisabled={false}>
      {(provided) => (
        <CourseCard
          ref={provided.innerRef}
          code={code}
          title={title}
          description={description}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          showOptions={showOptions}
        />
      )}
    </Draggable>
  );
};
