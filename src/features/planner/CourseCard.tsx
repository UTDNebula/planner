import { Card, CardContent, createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import React from 'react';

/**
 * Component properties for a {@link CourseCard}.
 */
interface CourseCardProps {
  code: string;
  title: string;
  description: string;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    minWidth: 368,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
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
  const {code, title, description} = props;
  const classes = useStyles();
  return (
    <Card>
      {/* TODO: Add option to show letter grade */}
      <CardContent>
        <Typography variant="h6" component="h2">{code}</Typography>
        <Typography className={classes.courseTitle}>{title}</Typography>
      </CardContent>
    </Card>
  );
}