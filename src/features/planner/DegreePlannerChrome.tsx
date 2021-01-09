import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core';
import { DragDropContext, DraggableLocation, DropResult } from 'react-beautiful-dnd';
import { useHistory, useParams } from 'react-router-dom';
import SemesterNavigationDrawer from './SemesterNavigationDrawer';
import AddSemesterTrigger from './AddSemesterTrigger';
import { convertSemesterToData } from '../common/data-utils';
import { SemesterCode, StudentPlan, Course, SEMESTER_CODE_MAPPINGS, createSamplePlan } from '../../app/data';

interface SemesterColumn {
  title: string;
  code: string;
  courseIds: string[];
}

/**
 * Component properties for a {@link DegreePlannerChrome}.
 */
interface DegreePlannerChromeProps {
}

interface AppParams {
  planId: string;
}

const useStyles = (columnCount: number) => makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  semesterNavigation: {
    width: 360,
  },
  semesterListContainer: {
    marginLeft: 180, // TODO: Fix this temporary hack
    backgroundColor: theme.palette.background.paper,
  },
  semesterList: {
    display: 'grid',
    gridGap: theme.spacing(2),
    gridTemplateColumns: `repeat(${columnCount}, calc(50% - 48px))`,
    gridTemplateRows: 'minmax(120px, 1fr)',
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
}))();


interface RecentSemester {
  year: number;
  semester: SemesterCode;
}

// TODO: Fix this obvious code smell; start from date of joining university
const START_YEAR = 2020;

const START_SEMESTER = SemesterCode.f;

/**
 * The root degree planner editor component.
 */
export default function DegreePlannerChrome(props: DegreePlannerChromeProps) {
  const [studentPlan, setStudentPlan] = React.useState<StudentPlan>();
  console.log('StudentPlan: ', studentPlan);

  // TODO: Consolidate into one attribute
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [plannerColumns, setPlannerColumns] = React.useState<{ [key: string]: SemesterColumn }>({});
  const [plannerCourses, setPlannerCourses] = React.useState<{ [key: string]: Course }>({});

  const [recentSemesterData, setRecentSemesterData] = React.useState<RecentSemester>({
    year: START_YEAR, semester: START_SEMESTER
  });

  const [focusedSemester, setFocusedSemester] = React.useState(0);

  /**
   * Move the item at the given start index to the given end index.
   *
   * @param courses The semester to reorder
   * @param startIndex The starting index of the item to move
   * @param endIndex The destination index of the item to move
   */
  function reorderSemester(courses: string[], startIndex: number, endIndex: number) {
    const result = Array.from(courses);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }

  function moveCourse<T>(
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

  function onDragEnd({ destination, source, draggableId }: DropResult) {
    if (!destination) {
      return;
    }

    const sourceSemester = source.droppableId;
    const destinationSemester = destination.droppableId;

    if (destinationSemester === sourceSemester && destination.index === source.index) {
      // Dragging from source to source, so no-op
      return;
    }

    const sourceSources = plannerColumns[sourceSemester].courseIds;
    if (destinationSemester === sourceSemester) {
      const reordered = reorderSemester(sourceSources, source.index, destination.index);
      const column = {
        ...plannerColumns[sourceSemester],
        courseIds: reordered,
      };
      setPlannerColumns({
        ...plannerColumns,
        [column.code]: column,
      });
    } else {
      const destinationCourses = plannerColumns[destinationSemester].courseIds;
      const movedItems = moveCourse(sourceSources, destinationCourses, source, destination);
      // const [sourceColumnCourses, destinationColumnCourses] = movedItems;
      const newSource = {
        ...plannerColumns[sourceSemester],
        courseIds: movedItems[source.droppableId],
      };
      const newDestination = {
        ...plannerColumns[destinationSemester],
        courseIds: movedItems[destination.droppableId],
      };
      setPlannerColumns({
        ...plannerColumns,
        [newSource.code]: newSource,
        [newDestination.code]: newDestination,
      });
    }
  }

  /**
   * Returns the index of the given semester, -1 if it doesn't exist.
   */
  function findSemester(semesterCode: string): number {
    return studentPlan?.semesters.findIndex(semester => {
      return semester.code === semesterCode;
    }) ?? 0;
  }

  /**
   * Generate metadata for adding a new semester.
   *
   * @param onlyLong Whether or not to only output long (fall/spring) semesters.
   */
  function getUpdatedSemesterData(onlyLong: boolean = true) {
    const { year, semester: code } = recentSemesterData;
    let updatedYear;
    let updatedSemester = code;
    if (code === SemesterCode.f) {
      updatedYear = year + 1;
      updatedSemester = SemesterCode.s;
    } else { // Semester code is either spring or summer
      updatedYear = year;
      if (onlyLong || code === SemesterCode.s) {
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

  function savePlanState() {
    // TODO: Save to persistent store
    console.debug('To be implemented');
  }

  function convertPlanToBlocks(plan: StudentPlan): {
    courses: { [key: string]: Course },
    semesterBlocks: { [key: string]: SemesterColumn },
    columnOrder: string[],
  } {
    const courses = plan.semesters.reduce((allCourses: {
      [key: string]: Course,
    }, semester) => {
      for (const course of semester.courses) {
        allCourses[course.id] = course;
      }
      return allCourses;
    }, {});

    const semesterBlocks = plan.semesters.reduce((blocks: {
      [key: string]: SemesterColumn
    }, semester) => {

      blocks[semester.code] = {
        ...semester,
        courseIds: semester.courses.map((course) => course.id),
      };
      return blocks;
    }, {});

    const columnOrder = plan.semesters.map((semester) => semester.code);

    return {
      courses,
      semesterBlocks,
      columnOrder,
    };
  }

  const { planId } = useParams<AppParams>();

  React.useEffect(() => {
    // Load plan into memory, prepare for modification
    const loadedPlan = createSamplePlan(4, planId);

    const lastSemesterCode = loadedPlan.semesters[loadedPlan.semesters.length - 1].code;
    const lastSemesterData = convertSemesterToData(lastSemesterCode);
    setRecentSemesterData({
      year: lastSemesterData.year,
      semester: lastSemesterData.semester,
    });

    console.log('Loaded plan');
    const { semesterBlocks, courses, columnOrder } = convertPlanToBlocks(loadedPlan);
    setStudentPlan(loadedPlan);
    setColumnOrder(columnOrder);
    setPlannerCourses(courses);
    setPlannerColumns(semesterBlocks);
  }, [planId]);


  /**
   * Focuses on a selected semester.
   *
   * @param semesterCode The identifier of the selected semester
   */
  const handleSemesterSelection = (semesterCode: string) => {
    console.log('Semester selected: ' + semesterCode);
    const semesterIndex = findSemester(semesterCode);
    setFocusedSemester(semesterIndex);
  };

  const navSemesterData = columnOrder.map((semesterId) => {
    const semester = plannerColumns[semesterId];
    return {
      code: semester.code,
      title: semester.title,
    };
  });

  const handleAddSemester = () => {
    const { year, semester } = recentSemesterData;
    const code = `${year}${semester}`;

    const newSemester = {
      title: `${year} ${SEMESTER_CODE_MAPPINGS[semester]}`,
      code: code,
      courseIds: [],
    };
    const newColumns = {
      ...plannerColumns,
      [code]: newSemester,
    };
    const newColumnOrder = columnOrder;
    newColumnOrder.push(code);

    setPlannerColumns(newColumns);
    setColumnOrder(newColumnOrder);

    // TODO: Fix this obviously smelly bit of code. Should just be "updateSemesterData"
    const updatedData = getUpdatedSemesterData();
    setRecentSemesterData(updatedData);
  }

  const getAddSemesterInfoText = () => {
    return 'Have some more classes to take?';
  };

  const addCourseToSemester = (semesterId: string) => {
    // TODO: Show dialog to add course to semester
    console.log('Not yet implemented.');
  };

  const showSemesterInfo = (semesterId: string) => {
    console.log('Not yet implemented.');
  };

  /**
   * Removes all the courses from a given semester.
   */
  const clearSemester = (semesterId: string) => {
    const newSemester = {
      ...plannerColumns[semesterId],
      courseIds: [],
    };
    setPlannerColumns({
      ...plannerColumns,
      [semesterId]: newSemester,
    });
  };

  const removeSemester = (semesterId: string) => {
    // TODO: Remove courses from given semester
    // const toRemove = plannerColumns[semesterId];
    // const courses = toRemove.courseIds;
    // delete plannerColumns[semesterId];
    console.log('Not yet implemented.');
  };

  const semesters: Semester[] = columnOrder.map((semesterId) => {
    const semester = plannerColumns[semesterId];
    const semesterCourses = semester.courseIds.map((courseId) => plannerCourses[courseId]);
    return {
      title: semester.title,
      code: semester.code,
      courses: semesterCourses,
    };
  });

  React.useEffect(() => {
    savePlanState();
    // TODO: Find better way of handling save
    // TODO: Undo/redo
  }, [columnOrder])

  const classes = useStyles(columnOrder.length + 1); // +1 accounts for additional AddSemesterTrigger

  const handleShowSemesterInfo = (semesterId: string) => {
    // FIXME: This definitely doesn't scale well.
    const semesterIndex = findSemester(semesterId);
    setFocusedSemester(semesterIndex);
  };

  return (
    <div className={classes.root}>
      <SemesterNavigationDrawer
        semesters={navSemesterData}
        selected={focusedSemester}
        onSelection={handleSemesterSelection} />
      <DragDropContext
        onDragEnd={onDragEnd}>
        <SemesterBlockList
          semesters={semesters}
          enabled={true}
          onAddCourse={addCourseToSemester}
          onClearSemester={clearSemester} // TODO: Probably ask with a confirmation dialog
          onRemoveSemester={removeSemester}
          onShowSemesterInfo={handleShowSemesterInfo}
          direction={ScrollDirection.vertically}>
          <AddSemesterTrigger
            infoText={getAddSemesterInfoText()}
            onAddSemester={handleAddSemester} />
        </SemesterBlockList>
      </DragDropContext>
    </div>
  );
}
