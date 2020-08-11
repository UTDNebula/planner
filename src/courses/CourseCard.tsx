import React from 'react';
import { Card, Typography, IconButton, makeStyles } from '@material-ui/core';
// import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Draggable, DraggableProvided } from 'react-beautiful-dnd';
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

const useStyles = makeStyles(() => ({
  courseCode: {
    fontWeight: 'bold',
  },
}));

/**
 * A draggable card that contains course information.
 */
function CourseCard(props: CourseCardProps): JSX.Element {
  const classes = useStyles();
  const { index, course, enabled } = props;

  /**
   * True if this card should show more information.
   */
  const [expanded, setExpanded] = React.useState(false);

  const courseCode = `${course.subject} ${course.suffix}`;

  return (
    <Draggable draggableId={course.id} index={index} key={course.id} isDragDisabled={!enabled}>
      {(provided: DraggableProvided) => (
        <Card ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <div className="course-card--header">
            <Typography variant="overline" className={classes.courseCode}>
              {courseCode}
            </Typography>
            <Typography variant="h6">{course.fullName}</Typography>
          </div>
          {/* TODO: Re-enable options button with appropriate styling */}
          {/* <IconButton aria-label="options">
            <MoreVertIcon />
          </IconButton> */}
        </Card>
      )}
    </Draggable>
  );
}

export default CourseCard;
