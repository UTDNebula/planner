import { Card, CardContent, createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

/**
 * Component properties for a {@link CourseCard}.
 */
interface CourseCardProps {
  id: string;
  code: string;
  title: string;
  description: string;
  index: number;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: 2,
  },
  courseTitle: {
    fontSize: 12,
  },
  courseCode: {
    fontSize: 16,
  },
}));

/**
 * A card showing course details.
 */
export default function CourseCard(props: CourseCardProps) {
  const { id, code, title, description, index } = props;
  const classes = useStyles();
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <Card className={classes.root}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          innerRef={provided.innerRef}>
          {/* TODO: Add option to show letter grade */}
          <CardContent>
            <Typography variant="h6" component="h2">{code}</Typography>
            <Typography variant="subtitle1" className={classes.courseTitle}>{title}</Typography>
            <Typography variant="body2" className={classes.courseTitle}>{description}</Typography>
          </CardContent>
        </Card>
      )}
    </Draggable >
  );
}