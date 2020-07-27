import React from 'react';
import CourseCard from '../courses/CourseCard';
import { Droppable, DroppableProvided } from 'react-beautiful-dnd';
import { ScheduleSemester } from '../lib/types';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import { Typography } from '@material-ui/core';
import './SemesterBlock.css';

interface SemesterBlockProps {
  enabled: boolean;
  semester: ScheduleSemester;
}

interface SemesterBlockState {
  courses: Array<any>; // TODO: Fix me
}

/**
 * A semester containing a list of CourseCards.
 */
export default class SemesterBlock extends React.Component<SemesterBlockProps, SemesterBlockState> {
  constructor(props: SemesterBlockProps) {
    super(props);
    this.state = {
      courses: [],
    };
  }

  private get termText() {
    const termCode = this.props.semester.term;
    return `Term ${termCode}`;
  }

  onCourseDrag() {}

  render(): JSX.Element {
    const displayedCourses = this.props.semester.courses.map((course, index) => {
      return (
        <CourseCard
          key={`${course.subject} ${course.suffix}`}
          index={index}
          course={course}
          enabled={this.props.enabled}
        ></CourseCard>
      );
    });
    return (
      <Box border={1} className="semester-block">
        <Typography variant="h6">{this.termText}</Typography>
        <Droppable droppableId={this.props.semester.term}>
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
}
