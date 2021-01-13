import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import CourseCard, { CourseCardProps } from './CourseCard';

/**
 * Component properties for a {@link DraggableCourseCard}.
 */
export interface DraggableCourseCardProps extends CourseCardProps {
  /**
   * A unique identifier and key for this card.
   */
  id: string;

  /**
   * This item's index in a list, used for drag and drop functionality.
   */
  index: number;

  /**
   * If true, drag and drop functionality is allowed for this card.
   */
  enabled: boolean;
}

/**
 * A draggable card showing course details.
 */
export default function DraggableCourseCard(props: DraggableCourseCardProps): JSX.Element {
  const { id, code, title, description, index, enabled, creditHours } = props;
  return (
    <Draggable key={id} draggableId={id} index={index} isDragDisabled={!enabled}>
      {(provided) => (
        <CourseCard
          ref={provided.innerRef}
          code={code}
          title={title}
          description={description}
          creditHours={creditHours}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          enabled={enabled}
        />
      )}
    </Draggable>
  );
}
