import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { addCourse, moveCourse, removeCourse, saveSchedule } from './actions';
import { ScheduleSemester, Schedule, Course } from '../lib/types';
import styled from 'styled-components';
import SemesterBlock from './SemesterBlock';
import {
  DragDropContext,
  DragStart,
  DragUpdate,
} from 'react-beautiful-dnd';

import dummySchedule from '../dummy_schedule.json';
import CourseSourceSidebar from './CourseSourceSidebar';

interface SchedulePlannerRouteInfo {
  id: string;
  part: string;
}

interface SchedulePlannerProps extends RouteComponentProps<SchedulePlannerRouteInfo> {
}

/**
 * Properties for a schedule planner's state.
 */
interface SchedulePlannerState {
  openSchedule: Schedule;
  sidebarCourses: Array<Course>;
}

const SchedulerHeader = styled.header`
  height: 64px;
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: orange;
  font-weight: bold;
  font-size: 24px;
`;

const SemesterListWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: row;
  overflow-x: auto;
`;

const GrowContainer = styled.div`
  flex-grow: 1;
`;

const PlannerWindow = styled.main`
  display: flex;
  height: 100%;
`;

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

/**
 * Generate a sample test schedule.
 */
function loadTestSchedule(): Schedule {
  // @ts-ignore
  return dummySchedule;
}

/**
 * A dashboard to plan out schedules. 
 */
class SchedulePlanner extends React.Component<SchedulePlannerProps, SchedulePlannerState> {

  constructor(props: SchedulePlannerProps) {
    super(props);
    this.state = {
      openSchedule: loadTestSchedule(),
      sidebarCourses: [],
    };
  }

  /**
   * True if the schedule is open for modification.
   */
  get inSchedulingMode(): boolean {
    return this.props.match.params.part === 'plan';
  }

  /**
   * The unique identifier of the currently open schedule.
   * 
   * If none is open, this will be undefined.
   */
  get scheduleId(): string {
    return this.props.match.params.id;
  }

  get semesters(): Array<ScheduleSemester> {
    return this.state.openSchedule.semesters;
  }

  private onDragStart(start: DragStart) {
    //contains the index of the card's home when dragging
    // const num: number = this.state.variable.columnOrder.indexOf(start.source.droppableId);

    //checks if card's home is the mainlist or within semester boards
    // const indexHome: number = (start.source.droppableId === 'courselist')
    //   ? 13
    //   : num;
  }
  
  private moveCourse(source: DraggableLocation, destination: DraggableLocation, draggableId: string) {
    const newSemesters = this.semesters;
    // Remove course from source semester
    const sourceIndex = this.semesters.findIndex(semester => semester.term === source.droppableId);
    const sourceSemester = this.semesters[sourceIndex];
    const updatedSourceCourses = sourceSemester.courses.filter(course => course.id !== draggableId);
    newSemesters[sourceIndex] = {
      term: sourceSemester.term,
      courses: updatedSourceCourses,
    };
    // Add course to destination semester
    const destinationIndex = this.semesters.findIndex(semester => semester.term === destination.droppableId);
    const destinationSemester = this.semesters[destinationIndex];
    const courseToAdd = sourceSemester.courses.find(course => course.id === draggableId) as Course;
    destinationSemester.courses.push(courseToAdd);
    newSemesters[destinationIndex] = destinationSemester;
    this.setState({
      openSchedule: {
        ...this.state.openSchedule,
        semesters: newSemesters,
      },
    });
  }

  private onDragEnd = (result: DragUpdate) => {
    const { source, destination, draggableId } = result;
    console.log(result);

    // Handle drops outside list
    if (!destination) {
      return; // no-op
    }

    if (destination.droppableId === SIDEBAR_DROPPABLE_ID) {
      // TODO: Delete the course from the schedule, update sidebar state
      return;
    }

    // Handle drops inside list
    if (source.droppableId === destination.droppableId) {
      // Source is the same list
      // Reorder? No-op for now
      return;
    }

    // Handle drops between lists
    if (source.droppableId !== destination.droppableId) {
      this.moveCourse(source, destination, draggableId);
      return;
    }
  }

  /** */
  // moveItem(source, destination, droppableSource, droppableDestination) {
  //   const sourceClone = Array.from(source);
  //   const destClone = Array.from(destination);
  //   const [removed] = sourceClone.splice(droppableSource.index, 1);

  //   destClone.splice(droppableDestination.index, 0, removed);

  //   const result = {};
  //   result[droppableSource.droppableId] = sourceClone;
  //   result[droppableDestination.droppableId] = destClone;

  //   return result;
  // }

  render() {
    return (
      <Wrapper>
        <SchedulerHeader>
          Comet Planning |
            In scheduling mode: {this.inSchedulingMode ? 'Yes' : 'No'} |
            Current schedule ID: {this.scheduleId}
            <NavLink to={this.inSchedulingMode ? '.': 'plan'}>
              {this.inSchedulingMode ? 'Switch to Viewing' : 'Switch to Planning'}
            </NavLink>
        </SchedulerHeader>
        <GrowContainer>
          <DragDropContext
            onDragStart={this.onDragStart}
            onDragEnd={this.onDragEnd}>
            <PlannerWindow>
              <CourseSourceSidebar
                courses={this.state.sidebarCourses}
                enabled={this.inSchedulingMode}>
              </CourseSourceSidebar>
              <SemesterListWrapper>
                {this.semesters.map(semester =>
                  <SemesterBlock key={semester.term}
                    semester={semester}
                    enabled={this.inSchedulingMode} />
                )}
              </SemesterListWrapper>
            </PlannerWindow>
          </DragDropContext>
        </GrowContainer>
      </Wrapper>
    );
  }
}

export default withRouter(connect(null, {
  addCourse,
  removeCourse,
  moveCourse,
  saveSchedule,
})(SchedulePlanner));
