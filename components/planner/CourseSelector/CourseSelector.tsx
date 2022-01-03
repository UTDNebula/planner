import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  createStyles,
  Fab,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import DummyData from '../../../data/dummy_planner_course_data.json';

import React, { useState } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { CardContainer } from './CardContainer';
import { CourseCardProps } from '../../common/CourseCard';
import AddIcon from '@material-ui/icons/Add';
import { Course, Semester } from '../../../modules/common/data';

export type CourseSelectedAction = 'Add' | 'Remove';

export type CourseSelectorProps = {
  coursesToAddHandler: (cousesToAdd: Course[]) => void;
};

/**
 * Sidebar that allows the user to add courses to their degree plan
 */
export default function CourseSelector({ coursesToAddHandler }: CourseSelectorProps) {
  /* Data needed:
    1. Degree Plan type
        - Categories in degree plan
        - Courses that need to be taken
    2. Course data from user
        - what user has taken already

    Use dummy data for now; will convert to Nebula API once finished
    */

  // TODO: Replace with actual course data
  // TODO: Figure out how to structure data

  // Getting first 20 courses (REFACTOR LATER)

  const DUMMY_COURSES: Course[] = DummyData;
  const DUMMY_CATEGORIES: string[] = [
    'Core Curriculum',
    'Major Prepatory Courses',
    'Upper Level Electives',
  ];

  const [courseCount, setCourseCount] = useState(0);
  const [addCourses, setAddCourses] = useState<Course[]>([]);

  // TODO: Pass down using useMemo instead
  const toggleCourseSelected = (course: Course, action: CourseSelectedAction) => {
    switch (action) {
      case 'Add':
        setCourseCount(courseCount + 1);
        setAddCourses([...addCourses, course]);
        break;
      case 'Remove':
        setCourseCount(courseCount - 1);
        setAddCourses(
          addCourses.filter((elm) => {
            elm.catalogCode !== course.catalogCode;
          }),
        );
    }
  };

  return (
    <div className="overflow-scroll h-screen">
      <div className="pt-px border-solid border-gray-200 border-2">
        <CardContainer
          category={DUMMY_CATEGORIES[0]}
          courses={DUMMY_COURSES}
          toggleCourseSelected={toggleCourseSelected}
        />
      </div>
      <div className="pt-px border-solid border-gray-200 border-2">
        <CardContainer
          category={DUMMY_CATEGORIES[1]}
          courses={DUMMY_COURSES}
          toggleCourseSelected={toggleCourseSelected}
        />
      </div>
      <div className="pt-px border-solid border-gray-200 border-2">
        <CardContainer
          category={DUMMY_CATEGORIES[2]}
          courses={DUMMY_COURSES}
          toggleCourseSelected={toggleCourseSelected}
        />
      </div>
      {courseCount > 0 && ( // TODO: Properly style FAB (position absolute & on right hand side)
        <Fab
          className="relative"
          variant="extended"
          color="primary"
          aria-label="add"
          onClick={() => coursesToAddHandler(addCourses)}
        >
          Add Courses
        </Fab>
      )}
    </div>
  );
}
