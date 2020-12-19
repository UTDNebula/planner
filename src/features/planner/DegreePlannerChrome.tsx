import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core';
import { DragDropContext } from 'react-beautiful-dnd';
import { useParams } from 'react-router-dom';
import SemesterBlock from './SemesterBlock';

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

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  semesterNavigation: {
    width: 360,
  },
}));


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

/**
 * The root degree planner editor component.
 */
export default function DegreePlannerChrome(props: DegreePlannerChromeProps) {
  const [studentPlan, setStudentPlan] = React.useState<StudentPlan>();

  // TODO: Consolidate into one attribute
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [plannerColumns, setPlannerColumns] = React.useState<{ [key: string]: SemesterColumn }>({});
  const [plannerCourses, setPlannerCourses] = React.useState<{ [key: string]: Course }>({});


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
      const plan = {
        id: planId,
        title: 'Test schedule',
        major: 'Computer Science',
        semesters: [
          {
            title: '2021 Spring',
            code: '2021s',
            courses: generateCourses(),
          },
          {
            title: '2021 Fall',
            code: '2021f',
            courses: generateCourses(),
          },
          {
            title: '2022 Spring',
            code: '2022s',
            courses: generateCourses(),
          },
        ],
      };
      return plan;
    }

    // Load schedule into memory, prepare for modification
    const loadedPlan = loadPlan(planId);
    console.log('Loaded plan');
    const { semesterBlocks, courses, columnOrder } = convertPlanToBlocks(loadedPlan);
    setStudentPlan(loadedPlan);
    setColumnOrder(columnOrder);
    setPlannerCourses(courses);
    setPlannerColumns(semesterBlocks);
  }, [planId]);

  const semesterNavList = studentPlan?.semesters.map(({ title, code }) => {
    return (
      <div key={code}>
        {title}
      </div>
    );
  });

  const displayedSemesters = columnOrder.map((semesterId) => {
    const semester = plannerColumns[semesterId];
    const semesterCourses = semester.courseIds.map((courseId) => plannerCourses[courseId]);
    return (
      <SemesterBlock key={semester.code} semesterCode={semester.code} semesterTitle={semester.title} courses={semesterCourses} />
    );
  });

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <section className={classes.semesterNavigation}>
        {/* TODO: Update styling */}
        {semesterNavList}
      </section>
      <DragDropContext
        onDragEnd={() => {}}
        onDragStart={() => {}}>
        <div>
          {displayedSemesters}
        </div>
      </DragDropContext>
    </div>
  );
}
