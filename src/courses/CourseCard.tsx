import React from 'react';
import styled from 'styled-components';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import { Course } from '../lib/types';

/**
 * A wrapper component for card contents.
 */
const Container = styled.div`
  border: 1px solid lightgrey;
  padding: 8px; 
  border-radius: 2px; 
  margin-bottom: 8px; 
  height: 100px;
`;

/**
 * Component properties for a {@link CourseCard}.
 */
interface CourseCardProps {

  /**
   * The position of this item in a droppable context.
   */
  index: number;

  /**
   * Course data to be displayed in a {@link CourseCard}.
   */
  course: Course;

  /**
   * True if draggable functionality is enabled.
   */
  enabled: boolean;
}

/**
 * Component state for a {@link CourseCard}.
 */
interface CourseCardState {

  /**
   * True if this card should show more information.
   */
  expanded: boolean;
}

/**
 * A draggable card that contains course information.
 */
export default class CourseCard extends React.Component<CourseCardProps, CourseCardState> {

  constructor(props: CourseCardProps) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  /**
   * Returns a formatted course code.
   *
   * Example: CS 1200
   */
  private get courseCode() {
    const course = this.props.course;
    return `${course.subject} ${course.suffix}`;
  }

  public render() {
    return (
      <Draggable
        draggableId={this.props.course.id}
        index={this.props.index}
        key={this.props.course.id}
        isDragDisabled={!this.props.enabled}>
        {(provided: DraggableProvided, _: DraggableStateSnapshot) => (
          <Container
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div>
              <h1>{this.courseCode}</h1>
              <div>{this.props.course.fullName}</div>
            </div>
          </Container>
        )}
      </Draggable>
    );
  }
}
