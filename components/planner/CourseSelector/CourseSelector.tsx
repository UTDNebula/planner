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
import React, { useEffect, useState } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { CardContainer } from './CardContainer';
import { CourseCardProps } from '../../common/CourseCard';
import AddIcon from '@material-ui/icons/Add';
import { Course, Semester } from '../../../modules/common/data';
import { AddNewCourseDialog } from '../AddCourseDialog/AddCourseDialog';
import DummyData from '../../../data/dummy_planner_course_data.json';
export type CourseSelectedAction = 'Add' | 'Remove';

/**
 *  List of courses a user is required or wants to take broken down into categories
 * */
export type CourseCategories = {
  category: string;
  courses: Course[];
};

export type CourseSelectorProps = {
  coursesToAddHandler: (cousesToAdd: Course[]) => void;
  coursesAddedHandler: () => void;
};

/**
 * TODO: Anything that needs to be done
 * 1. Add course validation
 *  - this means graying out courses that are already on planner
 */

/**
 * Sidebar that allows the user to add courses to their degree plan
 */
export default function CourseSelector({
  coursesToAddHandler,
  coursesAddedHandler,
}: CourseSelectorProps) {
  const DUMMY_COURSES: CourseCategories[] = DummyData;

  const [courseCount, setCourseCount] = useState(0);
  const [otherButton, setOtherButton] = useState(false);
  const [addCourses, setAddCourses] = useState<Course[]>([]);
  const [courses, setCourses] = useState<CourseCategories[]>(DUMMY_COURSES);

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

  const [isOpen, setIsOpen] = useState(false);

  const addUserCourses = (addCourses: Course[]) => {
    // TODO: Put these courses inside pre-existing categories if possible
    const newCourses = JSON.parse(JSON.stringify(courses));
    newCourses[newCourses.length - 1].courses.push(...addCourses);
    setCourses(newCourses);
  };

  return (
    <div className="overflow-scroll h-screen">
      <div className="pt-px border-solid border-gray-200 border-2">
        {courses.map((elm, index) => (
          <CardContainer
            key={elm.category}
            category={elm.category}
            courses={elm.courses}
            toggleCourseSelected={toggleCourseSelected}
          />
        ))}
      </div>
      <AddNewCourseDialog isOpen={isOpen} enableFocus={setIsOpen} addUserCourses={addUserCourses} />
      <button onClick={() => setIsOpen(!isOpen)}> Test </button>
      {courseCount > 0 &&
        !otherButton && ( // TODO: Properly style FAB (position absolute & on right hand side)
          <Fab
            className="relative"
            variant="extended"
            color="primary"
            aria-label="add"
            onClick={() => {
              coursesToAddHandler(addCourses);
              setOtherButton(true);
            }}
          >
            Add Courses
          </Fab>
        )}
      {otherButton && (
        <button
          onClick={() => {
            setOtherButton(false);
            coursesAddedHandler();
          }}
        >
          {' '}
          Done{' '}
        </button>
      )}
    </div>
  );
}
