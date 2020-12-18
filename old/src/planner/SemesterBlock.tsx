import React from 'react';
import CourseCard from '../courses/CourseCard';
import { Droppable, DroppableProvided } from 'react-beautiful-dnd';
import { ScheduleSemester } from '../lib/types';
import { Box, List, Typography } from '@material-ui/core';
import './SemesterBlock.css';

interface SemesterBlockProps {
  enabled: boolean;
  semester: ScheduleSemester;
}

function convertTermToText(term: string) {
  return `Term ${term}`;
}

/**
 * A semester containing a list of CourseCards.
 */
function SemesterBlock(props: SemesterBlockProps): JSX.Element {
  const { enabled, semester } = props;
  const displayedCourses = semester.courses.map((course, index) => {
    return (
      <CourseCard
        key={`${course.subject} ${course.suffix}`}
        index={index}
        course={course}
        enabled={enabled}
       />
    );
  });
  return (
    <Box border={1} className="semester-block">
      <Typography variant="h6">{convertTermToText(semester.term)}</Typography>
      <Droppable droppableId={semester.term}>
        {(provided: DroppableProvided, _) => (
          <List ref={provided.innerRef} {...provided.droppableProps}>
            {displayedCourses}
            {provided.placeholder}
          </List>
        )}
      </Droppable>
    </Box>
  );
}

export default SemesterBlock;
