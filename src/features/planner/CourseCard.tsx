import { Card, CardContent, createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import React from 'react';

/**
 * Component properties for a {@link CourseCard}.
 */
export interface CourseCardProps {
  code: string;
  title: string;
  description: string;
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
  const { code, title, description } = props;
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      {/* TODO: Add option to show letter grade */}
      <CardContent>
        <Typography variant="h6" component="h2">{code}</Typography>
        <Typography variant="subtitle1" className={classes.courseTitle}>{title}</Typography>
        <Typography variant="body2" className={classes.courseTitle}>{description}</Typography>
      </CardContent>
    </Card>
  );
}