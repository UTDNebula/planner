import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter, NavLink } from 'react-router-dom';
import { DragDropContext, DragStart, DragUpdate, DraggableLocation } from 'react-beautiful-dnd';
import { ScheduleSemester, PlanRequirement } from '../lib/types';
import { Schedule } from '../store/user/types';
import { Course } from '../store/catalog/types';
import { AppState } from '../store';
import { loadSchedule } from '../store/planner/thunks';
import { saveSchedule } from '../store/planner/slices/openScheduleSlice';
import { loadRequirements as loadScheduleRequirements } from '../store/user/thunks';
import { pushAction, popAction } from '../store/planner/slices/plannerActionSlice';
import { PlannerActionType } from '../store/planner/types';
import CourseSourceSidebar, { SIDEBAR_DROPPABLE_ID } from './sidebar/CourseSourceSidebar';
import SemesterBlock from './SemesterBlock';
import {
  SchedulerHeader,
  SemesterListWrapper,
  GrowContainer,
  PlannerWindow,
  Wrapper,
} from './SchedulePlannerStyle';

interface SchedulePlannerRouteInfo {
  id: string;
  part: string;
}

interface SchedulePlannerProps extends RouteComponentProps<SchedulePlannerRouteInfo> {
  loadSchedule: Function;
  saveSchedule: Function;
  loadRequirements: Function;
  pushAction: Function;
  popAction: Function;
}

/**
 * Properties for a schedule planner's state.
 */
interface SchedulePlannerState {
  /**
   * The currently open schedule.
   */
  schedule: Schedule | undefined;
  requirements: Array<PlanRequirement>;
}

/**
 * A dashboard to plan out schedules.
 */
class SchedulePlanner extends React.Component<SchedulePlannerProps, SchedulePlannerState> {
  constructor(props: SchedulePlannerProps) {
    super(props);
    this.state = {
      schedule: undefined,
      requirements: [],
    };
  }

  public async componentDidMount() {
    try {
      // TODO: Show loading animation
      const schedule = await this.props.loadSchedule({
        scheduleId: this.scheduleId,
      });
      console.log(schedule);
      this.setState({
        ...this.state,
        schedule,
      });
    } catch (e) {
      console.error(e);
    }
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

  /**
   * Shortcut accessor property for the semesters of the currently open schedule.
   */
  get semesters(): Array<ScheduleSemester> {
    // return this.state.openSchedule.semesters;
    const schedule = this.state.schedule;
    if (schedule) {
      return schedule.semesters;
    }
    return [];
  }

  private onDragStart(start: DragStart) {
    //contains the index of the card's home when dragging
    // const num: number = this.state.variable.columnOrder.indexOf(start.source.droppableId);
    //checks if card's home is the mainlist or within semester boards
    // const indexHome: number = (start.source.droppableId === 'courselist')
    //   ? 13
    //   : num;
  }

  private moveCourse(
    source: DraggableLocation,
    destination: DraggableLocation,
    draggableId: string,
  ) {
    const newSemesters = this.semesters;
    // Remove course from source semester
    const sourceIndex = this.semesters.findIndex(
      (semester) => semester.term === source.droppableId,
    );
    const sourceSemester = this.semesters[sourceIndex];
    const updatedSourceCourses = sourceSemester.courses.filter(
      (course) => course.id !== draggableId,
    );
    newSemesters[sourceIndex] = {
      term: sourceSemester.term,
      courses: updatedSourceCourses,
    };
    // Add course to destination semester
    const destinationIndex = this.semesters.findIndex(
      (semester) => semester.term === destination.droppableId,
    );
    const destinationSemester = this.semesters[destinationIndex];
    const courseToAdd = sourceSemester.courses.find(
      (course) => course.id === draggableId,
    ) as Course;
    destinationSemester.courses.push(courseToAdd);
    newSemesters[destinationIndex] = destinationSemester;
    this.updateSchedule(newSemesters);
    this.props.pushAction({
      operation: PlannerActionType.MOVE,
      data: {
        course: courseToAdd,
        semesterStart: source.droppableId,
        semesterEnd: destination.droppableId,
      },
    });
  }

  private updateSchedule(newSemesters: ScheduleSemester[]) {
    // this.setState({
    //   openSchedule: {
    //     ...this.state.openSchedule,
    //     semesters: newSemesters,
    //   },
    // });
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
  };

  public render() {
    const semesters = this.semesters?.map((semester) => (
      <SemesterBlock key={semester.term} semester={semester} enabled={this.inSchedulingMode} />
    ));
    return (
      <Wrapper>
        {/* TODO: Refractor SchedulerHeader into separate component */}
        <SchedulerHeader>
          {JSON.stringify(this.state.schedule)}
          {this.state.schedule ? this.state.schedule.name : 'Open a schedule'} | In scheduling mode:{' '}
          {this.inSchedulingMode ? 'Yes' : 'No'} | Current schedule ID: {this.scheduleId}
          <NavLink
            to={
              this.inSchedulingMode
                ? `/schedules/${this.scheduleId}`
                : `/schedules/${this.scheduleId}/plan`
            }
          >
            {this.inSchedulingMode ? 'Switch to Viewing' : 'Switch to Planning'}
          </NavLink>
        </SchedulerHeader>
        <GrowContainer>
          <DragDropContext onDragStart={this.onDragStart} onDragEnd={this.onDragEnd}>
            <PlannerWindow>
              <CourseSourceSidebar
                requirements={this.state.requirements}
                enabled={this.inSchedulingMode}
              />
              <SemesterListWrapper>{semesters}</SemesterListWrapper>
            </PlannerWindow>
          </DragDropContext>
        </GrowContainer>
      </Wrapper>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    courses: state.courses,
    // schedule: state.openSchedule,
  };
};

const mapDispatch = {
  loadSchedule: loadSchedule,
  saveSchedule: saveSchedule,
  loadRequirements: loadScheduleRequirements,
  pushAction,
  popAction,
};

const connector = connect(mapStateToProps, mapDispatch);

const ConnectedSchedulePlanner = connector(SchedulePlanner);

export default withRouter(ConnectedSchedulePlanner);
