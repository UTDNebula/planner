import React from 'react';
import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import { Droppable } from 'react-beautiful-dnd';
import CourseCard from './CourseCard';
import { Course } from './DegreePlannerChrome';

/**
 * Component properties for an {@link SemesterBlock}.
 */
interface SemesterBlockProps {
  semesterCode: string;
  semesterTitle: string;
  courses: Course[];
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    minWidth: 368,
    maxWidth: 368,
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
 * A list of {@link CourseCard}s.
 */
export default function SemesterBlock(props: SemesterBlockProps) {
  const { semesterCode, semesterTitle, courses } = props;
  const courseItems = courses.map(({ id, catalogCode, title, description }, index) => {
    return <CourseCard key={id} id={id} index={index} code={catalogCode} title={title} description={description} />;
  });

  const classes = useStyles();

  // TODO: Support non-course displays
  return (
    <div className={classes.root}>
      <header>
        <Typography variant="h6">
          {semesterTitle}
        </Typography>
      </header>
      <Droppable droppableId={semesterCode}>
        {(provided) =>
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {courseItems}
            {provided.placeholder}
          </div>
        }
      </Droppable>
    </div>
  );
}
