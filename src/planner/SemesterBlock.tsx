import React from 'react';
import CourseCard from '../courses/CourseCard';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Droppable, DroppableProvided } from 'react-beautiful-dnd';
import { ScheduleSemester } from '../lib/types';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import { theme } from '../styling';

interface SemesterBlockProps {
  enabled: boolean;
  semester: ScheduleSemester;
}

interface SemesterBlockState {
  courses: Array<any>; // TODO: Fix me
}

/**
const Container = styled.div`
  margin: 8px; 
  border: 1px solid black; 
  border-radius: 2px; 
  width: 368px;
  height: 100%;
  display: flex;
  flex-direction: column; 
`;

const TaskList = styled.div`
  padding: 9px; 
  font-family: Arial; 
  flex-grow: 1; 
`;
 */

/**
 * A semester
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

  render() {
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
      <MuiThemeProvider theme={theme}>
        <Box border={1}>
          <h1>{this.termText}</h1>
          <Droppable droppableId={this.props.semester.term}>
            {(provided: DroppableProvided, _) => (
              <List ref={provided.innerRef} {...provided.droppableProps}>
                {displayedCourses}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </Box>
      </MuiThemeProvider>
    );
  }
}
