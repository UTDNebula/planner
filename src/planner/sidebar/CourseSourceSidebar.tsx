import React from 'react';
import Box from '@material-ui/core/Box';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Droppable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import { PlanRequirement } from '../../lib/types';
import { theme } from '../../styling';
import { AppState } from '../../store';
import { Course } from '../../store/catalog/types';
import { searchCourse as searchCourses } from '../../store/catalog/thunks';
import PlanRequirementBlock from './PlanRequirementBlock';
import CourseSearch from './CourseSearch';

export const SIDEBAR_DROPPABLE_ID = 'courseSource';

/**
 * Component properties for the CourseSourceSidebar.
 */
interface CourseSourceSidebarProps {
  /**
   *
   */
  courses: Course[];

  /**
   * Course requirements displayed in this sidebar.
   */
  requirements: PlanRequirement[];

  /**
   * True if items in this sidebar can be modified.
   */
  enabled: boolean;
}

/**
 * A source to drag courses from.
 */
class CourseSourceSidebar extends React.Component<CourseSourceSidebarProps> {
  private onCardDrop() {
    // Eventually dispatch event to PlanRequirementBlock
  }

  public render() {
    const requirements = this.props.requirements.map((requirement, index) => (
      <PlanRequirementBlock
        key={requirement.name}
        enabled={this.props.enabled}
        requirement={requirement}
      />
    ));
    return (
      <MuiThemeProvider theme={theme}>
        <Box>
          <CourseSearch courses={this.props.courses} />
          <h1>Courses</h1>
          <Droppable droppableId={SIDEBAR_DROPPABLE_ID}>
            {(provided, _) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {requirements}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </Box>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    courses: state.courses,
  };
};

const mapDispatch = {
  searchCourses: searchCourses,
};

const connector = connect(mapStateToProps, mapDispatch);

const ConnectedCourseSourceSidebar = connector(CourseSourceSidebar);

export default ConnectedCourseSourceSidebar;
