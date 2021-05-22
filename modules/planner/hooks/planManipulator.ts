import React from 'react';
import { DropResult } from 'react-beautiful-dnd';
import {
  SemesterCode,
  StudentPlan,
  Course,
  SEMESTER_CODE_MAPPINGS,
  Semester,
} from '../../../app/data';
import { convertSemesterToData } from '../../common/data-utils';
import { moveDroppableCourse, reorderSemester } from './planManipulatorUtils';

interface SemesterColumn {
  title: string;
  code: string;
  courseIds: string[];
}

interface RecentSemester {
  year: number;
  semester: SemesterCode;
}

interface ActivePlanState {
  columns: {
    [semesterId: string]: SemesterColumn;
  };

  /**
   * An array containing IDs for the columns.
   */
  columnOrder: string[];

  /**
   * Metadata for the latest semester in the columns.
   */
  lastSemester: RecentSemester;
}

/**
 * Generate metadata for adding a new semester.
 *
 * @param onlyLong Whether or not to only output long (fall/spring) semesters.
 */
function getUpdatedSemesterData(recentSemesterData: RecentSemester, onlyLong = true) {
  const { year, semester } = recentSemesterData;
  let updatedYear;
  let updatedSemester = semester;
  if (semester === SemesterCode.f) {
    updatedYear = year + 1;
    updatedSemester = SemesterCode.s;
  } else {
    // Semester code is either spring or summer
    updatedYear = year;
    if (onlyLong || semester === SemesterCode.s) {
      updatedSemester = SemesterCode.f;
    } else {
      updatedSemester = SemesterCode.u;
    }
  }
  return {
    year: updatedYear,
    semester: updatedSemester,
  };
}

const START_YEAR = 2021;
const START_SEMESTER = SemesterCode.s;

function convertPlanToBlocks(
  plan: StudentPlan,
): {
  courses: { [key: string]: Course };
  semesterBlocks: { [key: string]: SemesterColumn };
  columnOrder: string[];
} {
  const courses = plan.semesters.reduce((allCourses: { [key: string]: Course }, semester) => {
    for (const course of semester.courses) {
      allCourses[course.id] = course;
    }
    return allCourses;
  }, {});

  const semesterBlocks = plan.semesters.reduce(
    (
      blocks: {
        [key: string]: SemesterColumn;
      },
      semester,
    ) => {
      blocks[semester.code] = {
        ...semester,
        courseIds: semester.courses.map((course) => course.id),
      };
      return blocks;
    },
    {},
  );

  const columnOrder = plan.semesters.map((semester) => semester.code);

  return {
    courses,
    semesterBlocks,
    columnOrder,
  };
}

function extractPlanData(plan: StudentPlan | null) {
  if (plan === null) {
    return {
      columns: {},
      columnOrder: [],
      lastSemester: {
        semester: SemesterCode.f,
        year: 2020,
      },
    };
  }
  const { semesterBlocks, columnOrder } = convertPlanToBlocks(plan);
  const { code } = semesterBlocks[columnOrder[Math.max(columnOrder.length - 1, 0)]];
  const { year, semester } = convertSemesterToData(code);
  return {
    columns: semesterBlocks,
    columnOrder: columnOrder,
    lastSemester: {
      semester,
      year,
    },
  };
}

/**
 * A hook that abstracts course movement between semesters;
 */
export function usePlanManipulator(plan: StudentPlan | null): PlanManipulatorReturnType {
  // TODO: Consolidate into one attribute
  const [planState, setPlanState] = React.useState<ActivePlanState>(() => {
    console.log('Now running callback');
    return extractPlanData(plan);
  });
  const [plannerCourses, setPlannerCourses] = React.useState<{ [key: string]: Course }>({});
  const [recentSemesterData, setRecentSemesterData] = React.useState<RecentSemester>({
    year: START_YEAR,
    semester: START_SEMESTER,
  });

  // let planState = extractPlanData(plan);

  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) {
      return;
    }

    const sourceSemester = source.droppableId;
    const destinationSemester = destination.droppableId;

    if (destinationSemester === sourceSemester && destination.index === source.index) {
      // Dragging from source to source, so no-op
      return;
    }

    const { columns } = planState;
    const sourceSources = columns[sourceSemester].courseIds;
    let newColumns;
    if (destinationSemester === sourceSemester) {
      const reordered = reorderSemester(sourceSources, source.index, destination.index);
      const column = {
        ...columns[sourceSemester],
        courseIds: reordered,
      };
      newColumns = {
        ...columns,
        [column.code]: column,
      };
    } else {
      const destinationCourses = columns[destinationSemester].courseIds;
      const movedItems = moveDroppableCourse(
        sourceSources,
        destinationCourses,
        source,
        destination,
      );
      const newSource = {
        ...columns[sourceSemester],
        courseIds: movedItems[source.droppableId],
      };
      const newDestination = {
        ...columns[destinationSemester],
        courseIds: movedItems[destination.droppableId],
      };
      newColumns = {
        ...columns,
        [newSource.code]: newSource,
        [newDestination.code]: newDestination,
      };
    }
    const newPlanState = {
      ...planState,
      columns: newColumns,
    };
    setPlanState(newPlanState);
    // planState.columns = newColumns;
  };

  const moveCourse = (courseId: string, startSemester: string, destinationSemester: string) => {
    console.log(`Moving ${courseId} from ${startSemester} to ${destinationSemester}`);
  };

  const removeCourse = (semesterId: string, courseId: string) => {
    console.log(`Removing ${courseId} from ${semesterId}`);
  };

  /**
   * Removes all the courses from a given semester.
   */
  const clearSemester = (semesterId: string) => {
    const { columns } = planState;
    const newSemester = {
      ...columns[semesterId],
      courseIds: [],
    };
    setPlanState({
      ...planState,
      columns: {
        ...columns,
        [semesterId]: newSemester,
      },
    });
    // planState.columns = {
    //   ...planState.columns,
    //   [semesterId]: newSemester,
    // };
  };

  const appendNewSemester = () => {
    const { columns, columnOrder } = planState;
    const { year, semester } = getUpdatedSemesterData(recentSemesterData);
    const code = `${year}${semester}`;

    const newSemester = {
      title: `${SEMESTER_CODE_MAPPINGS[semester]} ${year}`,
      code: code,
      courseIds: [],
    };
    const newColumns = {
      ...columns,
      [code]: newSemester,
    };
    const newColumnOrder = columnOrder;
    newColumnOrder.push(code);

    // TODO: Fix this obviously smelly bit of code. Should just be "updateSemesterData"
    const updatedData = getUpdatedSemesterData(recentSemesterData);
    setRecentSemesterData(updatedData);

    const newPlanState = {
      columns: newColumns,
      columnOrder: newColumnOrder,
      lastSemester: updatedData,
    };
    setPlanState(newPlanState);
    // planState = newPlanState;
  };

  const removeSemester = (semesterId: string) => {
    const newColumns = planState.columns;
    delete newColumns[semesterId];
    const index = planState.columnOrder.findIndex((code) => code === semesterId);
    const newColumnOrder = planState.columnOrder.slice(index, 1);
    const newLastSemester = planState.lastSemester;
    setPlanState({
      columns: newColumns,
      columnOrder: newColumnOrder,
      lastSemester: newLastSemester,
    });
    // planState = {
    //   columns: newColumns,
    //   columnOrder: newColumnOrder,
    //   lastSemester: newLastSemester,
    // };
  };

  const addCourseToSemester = (semesterId: string, courses: Course[]) => {
    const courseIds = courses.map((course) => course.id);
    // This might be a bad idea.
    planState.columns[semesterId].courseIds.push(...courseIds);
    const keyedCourses = courses.reduce((acc: { [key: string]: Course }, course) => {
      acc[course.id] = course;
      return acc;
    }, {});
    setPlannerCourses({
      ...plannerCourses,
      ...keyedCourses,
    });
  };

  // React.useEffect(() => {
  //   setPlanState(extractPlanData(plan));
  // }, [plan]);

  const { columns, columnOrder } = planState;

  const semesters: Semester[] = columnOrder.map((semesterId) => {
    const semester = columns[semesterId];
    const semesterCourses = semester.courseIds.map((courseId) => plannerCourses[courseId]);
    return {
      title: semester.title,
      code: semester.code,
      courses: semesterCourses,
    };
  });

  const semesterTitles = columnOrder.reduce((acc: { [semester: string]: string }, semesterId) => {
    acc[semesterId] = columns[semesterId].title;
    return acc;
  }, {});

  // const semesters = [];
  // const semesterTitles = [];

  return {
    semesters,
    semesterTitles,
    onDragEnd,
    appendNewSemester,
    addCourseToSemester,
    clearSemester,
    removeSemester,
    moveCourse,
    removeCourse,
  };
}

type SemesterCallback = (semesterId: string) => void;

type PlanManipulatorReturnType = {
  semesters: Semester[];
  semesterTitles: { [semesterCode: string]: string };
  onDragEnd: (result: DropResult) => void;
  appendNewSemester: () => void;
  addCourseToSemester: (semesterId: string, courses: Course[]) => void;
  clearSemester: SemesterCallback;
  removeSemester: SemesterCallback;
  moveCourse: (courseId: string, startSemester: string, destinationSemester: string) => void;
  removeCourse: (courseId: string, semesterId: string) => void;

  /**
   * Convert
   */
  // savePlan: () => StudentPlan;
};
