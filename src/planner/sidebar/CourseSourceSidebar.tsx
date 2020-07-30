import React from 'react';
import { Typography } from '@material-ui/core';
import { Droppable } from 'react-beautiful-dnd';
import { connect, useSelector, useDispatch } from 'react-redux';
import { PlanRequirement } from '../../lib/types';
import { RootState } from '../../store/reducers';
import { Course } from '../../store/catalog/types';
import { searchCourse as searchCourses } from '../../store/catalog/thunks';
import PlanRequirementBlock from './PlanRequirementBlock';
import CourseSearch from './CourseSearch';
import './CourseSourceSidebar.css';

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

  // onCourseRemoved: (courseId: string) => void;

  // onCourseAdded: (courseId: string) => void;
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
      <section className="course-source-sidebar">
        <CourseSearch courses={this.props.courses} />
        <div className="plan-requirement-list">
          <Typography variant="h5" className="course-source-sidebar--header">
            Degree Plan Requirements
          </Typography>
          <Droppable droppableId={SIDEBAR_DROPPABLE_ID}>
            {(provided, _) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {requirements}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </section>
    );
  }
}

const mapStateToProps = (state: RootState) => {
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
