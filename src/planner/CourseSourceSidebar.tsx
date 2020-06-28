import React from 'react';
//import styled from 'styled-components';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Droppable, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';
import { PlanRequirement, Course } from '../lib/types';
import { CourseCard } from '.';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import { theme } from '../styling';

export const SIDEBAR_DROPPABLE_ID = 'sourceCourse';

/** 
const SidebarContainer = styled.div`
  margin: 8px;
  border: 1px solid black;
  border-radius: 2px;
  width: 480px;
  height: 100%;
`;

const CourseList = styled.div`
  padding: 9px;
  font-family: Arial;
  flex-grow: 1; 
`;
*/

interface PlanRequirementBlockProps {

  /**
   * Required courses for a degree plan.
   */
  requirement: PlanRequirement;
}

interface PlanRequirementBlockState {

  /**
   * False if more information should be shown for this course.
   */
  collapsed: boolean;
}

/**
 * A collection of courses under a specific designation.
 */
class PlanRequirementBlock extends React.Component<PlanRequirementBlockProps, PlanRequirementBlockProps> {
  public render() {
    const courses = this.props.requirement.courses.map((course, index) => {
      return <CourseCard
        index={index}
        course={course}
        enabled={true}></CourseCard>
      // TODO: Handle index offset due to position in plan requirement list
    });
    return (
      <div>
        <h2>{this.props.requirement.name}</h2>
        <List>
          {courses}
        </List>
      </div>
    )
  }
}

/**
 * A source to drag courses from.
 */
export default class CourseSourceSidebar extends React.Component<{ courses: Array<Course>, enabled: boolean }> {
  private onCardDrop() {
    // Eventually dispatch event to PlanRequirementBlock
  }
  
  public render() {
    const courses = this.props.courses.map((course, index) =>
      <CourseCard course={course} index={index} enabled={this.props.enabled}></CourseCard>
    );
    return (
      <MuiThemeProvider theme = {theme}>
      <Box>
        <h1>Courses</h1>
        <Droppable droppableId="sourceCourse">
          {(provided: DroppableProvided, _: DroppableStateSnapshot) => (
            <List ref={provided.innerRef} {...provided.droppableProps}>
              {courses}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </Box>
      </MuiThemeProvider>
    );
  }
}