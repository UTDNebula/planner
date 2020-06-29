import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { theme } from '../styling';
import { Course } from '../store/catalog/types';

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

  public render(): React.ReactNode {
    return (
      <MuiThemeProvider theme={theme}>
        <Draggable
          draggableId={this.props.course.id}
          index={this.props.index}
          key={this.props.course.id}
          isDragDisabled={!this.props.enabled}
        >
          {(provided: DraggableProvided) => (
            <Card
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <div>
                <Typography>{this.courseCode}</Typography>
                <div>{this.props.course.fullName}</div>
              </div>
            </Card>
          )}
        </Draggable>
      </MuiThemeProvider>
    );
  }
}
