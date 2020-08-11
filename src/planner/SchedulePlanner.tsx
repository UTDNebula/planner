import React from 'react';
import { Typography } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  DragDropContext,
  DraggableLocation,
  DropResult,
} from 'react-beautiful-dnd';
import { ScheduleSemester, PlanRequirement, CoursePlan } from '../lib/types';
import { Schedule } from '../store/user/types';
import { Course } from '../store/catalog/types';
import { RootState } from '../store/reducers';
import {
  loadRequirements,
  refreshSchedules,
} from '../store/user/thunks';
import { AppDispatch } from '../store';
import { pushAction, popAction } from '../store/planner/slices/plannerActionSlice';
import CourseSourceSidebar, { SIDEBAR_DROPPABLE_ID } from './sidebar/CourseSourceSidebar';
import SemesterBlockList from './SemesterBlockList';
import SchedulePlannerAppBar from './toolbar/SchedulePlannerAppBar';
import { GrowContainer, PlannerWindow, Wrapper } from './SchedulePlannerStyle';
import { fetchSchedule } from '../lib/api';
import { storeSchedule } from '../lib/storage';
import sampleDegreePlan from '../data/sample_degree_plan.json';
import { generateSemesters } from './utils';
import './SchedulePlanner.css';

interface SchedulePlannerRouteInfo {
  id: string;
  part: string;
}

/**
 * A dashboard to plan out schedules.
 */
function SchedulePlanner(): JSX.Element {
  // Data
  const [activeSchedule, setActiveSchedule] = React.useState<Schedule | null>(null);
  const [planRequirements, setPlanRequirements] = React.useState<PlanRequirement[]>([]);
  const [semesters, setSemesters] = React.useState<{ [key: string]: ScheduleSemester }>({});

  const { schedules, requirements, user } = useSelector((state: RootState) => ({
    schedules: state.schedules,
    requirements: state.requirements, // Catalog requirements
    user: state.user.data,
  }));

  // "Actual" state
  const [inEditMode, setInEditMode] = React.useState(true);
  const [loading, setLoading] = React.useState(false); // Component-wide loading status
  const [showError, setShowError] = React.useState(false);
  const [message, setMessage] = React.useState('Something went wrong.'); // Snackbar-like message

  const { scheduleId } = useParams<{ scheduleId: string }>();

  const dispatch = useDispatch<AppDispatch>();

  React.useEffect(() => {
    console.log('Refreshing schedules');
    dispatch(refreshSchedules(user.id));
  }, [user]);

  React.useEffect(() => {
    // TODO: Fix store to prevent the absurd amount of state updates
    console.log('Reloading schedules');
    console.log('New ID ' + scheduleId);
    if (scheduleId in schedules.data) {
      const schedule = { ...schedules.data[scheduleId] };
      console.log('Schedule loaded from store');
      if (schedule.semesters.length === 0) {
        const semesters: { [key: string]: ScheduleSemester } = {};
        for (const semester of generateSemesters()) {
          semesters[semester.term] = semester;
        }
        setSemesters(semesters);
      }
      console.log('Updated schedule');
      console.log(schedule);
      setActiveSchedule(schedule);
    } else {
      console.log('Could not find schedule in store.');
      // TODO: Show snackbar message
    }
  }, [scheduleId, schedules]);

  function normalize<T extends { id: string }>(objects: T[]) {
    const normalized: { [id: string]: T } = {};
    for (const object of objects) {
      normalized[object.id] = object;
    }
    return normalized;
  }

  function denormalize<T>(objects: { [key: string]: T }) {
    return Object.values(objects);
  }

  function moveItem<T>(
    source: Array<T>,
    destination: Array<T>,
    droppableSource: DraggableLocation,
    droppableDestination: DraggableLocation,
  ) {
    const clonedSource = Array.from(source);
    const clonedDestination = Array.from(destination);
    const [removed] = clonedSource.splice(droppableSource.index, 1);

    clonedDestination.splice(droppableDestination.index, 0, removed);

    return {
      [droppableSource.droppableId]: clonedSource,
      [droppableDestination.droppableId]: clonedDestination,
    };
  }

  function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }

  const moveCourseFromSidebarToSemester = (
    destinationId: string,
    source: DraggableLocation,
    destination: DraggableLocation,
  ) => {
    // TODO: Remove from sidebar
    const sidebarCourses = [];
    // const requirements = [];
    // setPlanRequirements(requirements);
    // TODO: Replace with semesters-like ID indexing

    const courses: Course[] = [];
    for (const semester of planRequirements) {
      courses.push(...semester.courses);
      // Probably inefficient; find a way to do this in-place
    }

    const destinationSemester = semesters[destinationId];
    const destinationCourses = Array.from(destinationSemester.courses);
    // TODO: There's probably a code smell here by not cloning the requirement courses
    const [removed] = courses.splice(source.index, 1);

    destinationCourses.splice(destination.index, 0, removed);
    const updatedSemesters = {
      ...semesters,
      [destinationId]: {
        ...destinationSemester,
        courses: destinationCourses,
      },
    };
    setSemesters(updatedSemesters);
  };

  const onDragStart = () => {
    // Temporarily hide headers to avoid drag and drop side-effects
    // TODO: Fix header/card overlap when dragging card
  };

  /**
   * Handle movement of courses when drag and drop action ends.
   */
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) {
      return; // Item has been dropped outside of list
    }

    const sourceId = source.droppableId; // The semester/sidebar ID
    const destinationId = destination.droppableId; // The semester/sidebar ID

    // Handle dragging from sidebar
    if (sourceId === SIDEBAR_DROPPABLE_ID) {
      moveCourseFromSidebarToSemester(destinationId, source, destination);
    } else {
      if (destinationId === SIDEBAR_DROPPABLE_ID) {
        // Dragging from semesters to sidebar, no-op
        // TODO: Handle deletion logic
        return;
      }
      // It's being dropped from a semester
      if (destinationId === sourceId) {
        // It' just a reordering
        const semester = semesters[sourceId];
        const newCourses = reorder(semester.courses, source.index, destination.index);
        const newSemesters = { ...semesters };
        newSemesters[sourceId].courses = newCourses;
        setSemesters(newSemesters);
      } else {
        // Actually move something
        const sourceCourses = semesters[sourceId].courses;
        const destinationCourses = semesters[destinationId].courses;
        const result = moveItem(sourceCourses, destinationCourses, source, destination);
        const movedSource = result[sourceId];
        const movedDestination = result[destinationId];
        const newSemesters = {
          ...semesters,
          [sourceId]: {
            ...semesters[sourceId],
            courses: movedSource,
          },
          [destinationId]: {
            ...semesters[destinationId],
            courses: movedDestination,
          },
        };
        setSemesters(newSemesters);
      }
    }
  };

  const handleToggleEdit = (shouldEdit: boolean) => {
    setInEditMode(shouldEdit);
  };

  const handleScheduleSave = () => {
    // TODO: Use higher-level API to save based on currently active user
    if (!activeSchedule) {
      console.warn('Save triggered but no schedule is loaded.');
      return;
    }
    const denormalizedSemesters = Object.values(semesters).map((semester) => semester);
    const savedSchedule = { ...activeSchedule, semesters: denormalizedSemesters };
    storeSchedule(user.id, savedSchedule);
    console.debug(`Schedule ${savedSchedule.id} saved.`);
  };

  const onSemesterMoved = (start: string, end: string, semesterId: string) => {};

  const onCourseMoved = (start: string, end: string, courseId: string) => {};

  const loadSampleDegreePlan = () => {
    const coursePlan = sampleDegreePlan as CoursePlan;
    setPlanRequirements(coursePlan.requirements);
    console.log('Degree plan loaded');
    // TODO: Calculate difference between expected catalog requirements and courses in schedule
    // planRequirements = catalogRequirements - activeSchedule.sources
  };

  // Generate the selected courses
  React.useEffect(
    () => {
      // TODO: Load sample degree plan based on chosen majors/minors
      loadSampleDegreePlan();
    },
    [
      /* TODO: Add planRequirements */
    ],
  );

  const body = activeSchedule ? (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <PlannerWindow>
        <CourseSourceSidebar requirements={planRequirements} enabled={inEditMode} />
        <SemesterBlockList
          onSemesterMoved={onSemesterMoved}
          onCourseMoved={onCourseMoved}
          enabled={inEditMode}
          semesters={semesters}
        />
      </PlannerWindow>
    </DragDropContext>
  ) : (
    <div className="schedule-planner--empty">
      <Typography variant="h5">Open a schedule to get started!</Typography>
    </div>
  );
  const name = activeSchedule ? activeSchedule.name : 'Schedule Planner';
  return (
    <Wrapper>
      <SchedulePlannerAppBar
        title={name}
        onToggleEdit={handleToggleEdit}
        onTriggerSave={handleScheduleSave}
      />
      <GrowContainer>{body}</GrowContainer>
    </Wrapper>
  );
}

export default SchedulePlanner;
