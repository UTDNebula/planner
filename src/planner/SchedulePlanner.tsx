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

  private onDragEnd(result: DragUpdate) {
    const { source, destination } = result;

    // Handle drops outside list
    if (!destination) {
      return; // no-op
    }

    if (destination.droppableId === 'sourceCourse') {

    }

    // Handle drops inside list
    if (source.droppableId === destination.droppableId) {
      // Source is the same list
      
    } else {
      // Source is different list

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

  // private onDragEnd(result: DragUpdate) {
  //   console.log('card dropped');

  //   const newVar = {
  //     ...initial,
  //     homeIndex: null,
  //   }
  //   this.setState({
  //     variable: newVar,
  //   });


  //   const { destination, source, draggableId } = result;

  //   // Card doesn't go out of bounds
  //   if (!destination) {
  //     return;
  //   }

  //   // Card is on the same place
  //   if (destination.droppableId === source.droppableId &&
  //     destination.index === source.index) {
  //     return;
  //   }

  //   //where the card is dragged from 
  //   const home: semester | list = (source.droppableId === 'courselist') ?
  //     this.state.variable.courselist : this.state.variable.semesters[source.droppableId];


  //   //where the card is being dragged to 
  //   const foreign: semester | list = (destination.droppableId === 'courselist') ?
  //     this.state.variable.courselist : this.state.variable.semesters[destination.droppableId];

  //   //contains the task ids inside a specific board
  //   const hometaskIds: string[] = Array.from(home.taskIds);

  //   //removes that specific task from the home board
  //   hometaskIds.splice(source.index, 1);

  //   console.log(hometaskIds);

  //   //new state of the previous column a card left 
  //   const newHome = {
  //     ...home,
  //     taskIds: hometaskIds,
  //   };

  //   //contains the task ids inside the board that the card is dropping to
  //   const foreigntaskIds: string[] = Array.from(foreign.taskIds);

  //   //removes that specific task from the destination board
  //   foreigntaskIds.splice(destination.index, 0, draggableId);


  //   const newForeign = {
  //     ...foreign,
  //     taskIds: foreigntaskIds,
  //   }


  //   //console.log(foreigntaskIds);


  //   //moving of cards between different boards 
  //   if (newHome.id === 'courselist' && newForeign.id !== 'courselist') {
  //     const newState = {
  //       ...this.state.variable,
  //       semesters: {
  //         ...this.state.variable.semesters,
  //         [newForeign.id]: newForeign,
  //       },
  //       courselist: {
  //         ...this.state.variable.courselist,
  //         taskIds: newHome.taskIds,
  //       },
  //     };

  //     this.setState({
  //       variable: newState,
  //     });

  //     console.log(newState);


  //   }
  //   else if (newHome.id === newForeign.id) {

  //     const newTaskIds = Array.from(home.taskIds);
  //     newTaskIds.splice(source.index, 1);
  //     newTaskIds.splice(destination.index, 0, draggableId);

  //     const newHome = {
  //       ...home,
  //       taskIds: newTaskIds,
  //     };

  //     const newState = {
  //       ...this.state.variable,
  //       semesters: {
  //         ...this.state.variable.semesters,
  //         [newHome.id]: newHome,
  //       },
  //     };

  //     this.setState({
  //       variable: newState,
  //     });

  //   }
  //   else if (newHome.id !== 'courselist' && newForeign.id !== 'courselist') {
  //     const newState = {
  //       ...this.state.variable,
  //       semesters: {
  //         ...this.state.variable.semesters,
  //         [newHome.id]: newHome,
  //         [newForeign.id]: newForeign,
  //       },
  //     };
  //     this.setState({
  //       variable: newState,
  //     });

  //   }
  //   else if (newHome.id !== 'courselist' && newForeign.id === 'courselist') {
  //     const newState = {
  //       ...this.state.variable,
  //       semesters: {
  //         ...this.state.variable.semesters,
  //         [newHome.id]: newHome,

  //       },
  //       courselist: {
  //         ...this.state.variable.courselist,
  //         taskIds: newForeign.taskIds,
  //       },
  //     }

  //     this.setState({
  //       variable: newState,
  //     });

  //   }
  // }

  render() {
    return (
      <Wrapper>
        <SchedulerHeader>
          Comet Planning |
            In scheduling mode: {this.inSchedulingMode ? 'Yes' : 'No'} |
            Current schedule ID: {this.scheduleId}
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
                    enabled={true} />
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
