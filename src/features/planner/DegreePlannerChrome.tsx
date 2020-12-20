import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core';
import { DragDropContext } from 'react-beautiful-dnd';
import { useParams } from 'react-router-dom';
import SemesterBlock from './SemesterBlock';
import SemesterNavigationDrawer from './SemesterNavigationDrawer';
import AddSemesterTrigger from './AddSemesterTrigger';

export interface Course {
  id: string;
  title: string;
  catalogCode: string;
  description: string;
}

/**
 * Backing data type for a SemesterBlock.
 */
export interface Semester {
  title: string;
  code: string;
  courses: Course[];
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


interface StudentPlan {
  id: string;
  title: string;
  major: string;
  semesters: Semester[];
}

interface SemesterColumn {
  title: string;
  code: string;
  courseIds: string[];
}

enum SemesterCode {
  'f' = 0,
  's' = 1,
  'u' = 2,
}

/**
 * A mapping of {@link SemesterCode}s to human-readable titles.
 */
const SEMESTER_CODE_MAPPINGS = {
  [SemesterCode.f]: 'Fall',
  [SemesterCode.s]: 'Spring',
  [SemesterCode.u]: 'Summer',
};

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

  function generateCourses(amount: number = 5): Course[] {
    const courses = [];
    for (let i = 0; i < amount; ++i) {
      const id = Math.floor(Math.random() * (5000 - 1000) + 1000);
      courses.push({
        id: id.toString(),
        title: 'A course with a code.',
        catalogCode: `CS ${id}`,
        description: 'Just another course. What can we say?',
      });
    }
    return courses;
  }

  const { planId } = useParams<AppParams>();

  React.useEffect(() => {

    function loadPlan(planId: string): StudentPlan {
      function generateSemesters(amount: number = 4, onlyLong: boolean = true): Semester[] {
        const result = [];
        let semester = START_SEMESTER;
        let year = START_YEAR;
        for (let i = 0; i < amount; ++i) {
          const code = `${year}${semester}`;
          const newSemester = {
            title: `${year} ${SEMESTER_CODE_MAPPINGS[semester]}`,
            code: code,
            courses: generateCourses(),
          };
          result.push(newSemester);
          if (semester === SemesterCode.f) {
            year = year + 1;
            semester = SemesterCode.s;
          } else { // Semester code is either spring or summer
            if (onlyLong || semester === SemesterCode.s) {
              semester = SemesterCode.f;
            } else {
              semester = SemesterCode.u;
            }
          }
        }
        setRecentSemesterData({
          year,
          semester,
        });
        return result;
      }

      const plan = {
        id: planId,
        title: 'Test plan',
        major: 'Computer Science',
        semesters: generateSemesters(),
      };
      return plan;
    }

    // Load plan into memory, prepare for modification
    const loadedPlan = loadPlan(planId);
    console.log('Loaded plan');
    const { semesterBlocks, courses, columnOrder } = convertPlanToBlocks(loadedPlan);
    setStudentPlan(loadedPlan);
    setColumnOrder(columnOrder);
    setPlannerCourses(courses);
    setPlannerColumns(semesterBlocks);
  }, [planId]);


  const handleSemesterSelection = (semesterCode: string) => {
    // TODO: Navigate to semester
    console.log('Semester selected: ' + semesterCode);
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

  const displayedSemesters = columnOrder.map((semesterId) => {
    const semester = plannerColumns[semesterId];
    const semesterCourses = semester.courseIds.map((courseId) => plannerCourses[courseId]);
    return (
      <SemesterBlock
        key={semester.code}
        semesterCode={semester.code}
        semesterTitle={semester.title}
        courses={semesterCourses}
        onAddCourse={addCourseToSemester}
        onShowSemesterInfo={showSemesterInfo}
        onClearSemester={clearSemester}
        onRemoveSemester={removeSemester} />
    );
  });

  React.useEffect(() => {
    savePlanState();
    // TODO: Find better way of handling save
    // TODO: Undo/redo
  }, [columnOrder])

  const classes = useStyles(columnOrder.length + 1); // +1 accounts for additional AddSemesterTrigger

  return (
    <div className={classes.root}>
      <SemesterNavigationDrawer semesters={navSemesterData} onSelection={handleSemesterSelection} />
      <DragDropContext
        onDragEnd={() => { }}
        onDragStart={() => { }}>
        <div className={classes.semesterListContainer}>
          <div className={classes.semesterList}>
            {displayedSemesters}
            <AddSemesterTrigger
              infoText={getAddSemesterInfoText()}
              onAddSemester={handleAddSemester} />
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}
