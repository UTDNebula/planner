import { Fab } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { CardContainer } from './CardContainer';
import { CourseCardProps } from '../../common/CourseCard';
import AddIcon from '@material-ui/icons/Add';
import { Course, Semester } from '../../../modules/common/data';
import { AddNewCourseDialog } from '../AddCourseDialog/NewAddCourseDialog';
import DummyData from '../../../data/dummy_planner_course_data.json';
import { loadCourses } from '../../../modules/common/api/courses';
import useSearch from '../../search/search';
import SearchBar from '../../search/SearchBar';
import { Card } from './Card';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { v4 as uuid } from 'uuid';

export type CourseSelectedAction = 'Add' | 'Remove';

/**
 *  List of courses a user is required or wants to take broken down into categories
 * */
export type CourseCategories = {
  category: string;
  courses: Course[];
};

export type CourseSelectorProps = {
  // coursesToAddHandler: (cousesToAdd: Course[]) => void;
  // coursesAddedHandler: () => void;
  results: Course[];
  updateQuery: (query: string) => void;
};

/**
 * TODOs
 * 1. Refactor so that courses are pulled from Nebula API
 * 2. Add course validation
 *  - this means graying out courses that are already on planner
 * 3. Properly style CardContainer
 */

/**
 * Sidebar that allows the user to add courses to their degree plan
 */
export default function CourseSelector({
  // coursesToAddHandler,
  // coursesAddedHandler,
  results,
  updateQuery,
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

  /* Temporary Code */

  const handleSearch = (query: string) => {
    updateQuery(query);
  };

  // Run updateQuery on dialog screen load
  React.useEffect(() => {
    updateQuery('');
  }, []);

  return (
    <div className="flex flex-col ml-4 max-h-[83vh] w-[19rem] p-0 mt-2 overflow-y-scroll">
      <Droppable key={'selector'} droppableId={'selector'} isDropDisabled={true}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <SearchBar updateQuery={handleSearch} />
            {results.map((elm, index) => {
              return (
                <Draggable key={elm.id} draggableId={elm.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      className=""
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Card key={elm.id} props={elm} toggleCourseSelected={toggleCourseSelected} />
                    </div>
                  )}
                </Draggable>
              );
            })}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>

    // <div className="overflow-scroll h-screen">
    //   <div className="pt-px border-solid border-gray-200 border-2">
    //     {courses.map((elm, index) => (
    //       <CardContainer
    //         key={elm.category}
    //         category={elm.category}
    //         courses={elm.courses}
    //         toggleCourseSelected={toggleCourseSelected}
    //       />
    //     ))}
    //   </div>
    //   <AddNewCourseDialog isOpen={isOpen} enableFocus={setIsOpen} addUserCourses={addUserCourses} />
    //   <button onClick={() => setIsOpen(!isOpen)}> Search Courses </button>
    //   {courseCount > 0 &&
    //     !otherButton && ( // TODO: Properly style FAB (position absolute & on right hand side)
    //       <Fab
    //         className="relative"
    //         variant="extended"
    //         color="primary"
    //         aria-label="add"
    //         onClick={() => {
    //           coursesToAddHandler(addCourses);
    //           setOtherButton(true);
    //         }}
    //       >
    //         Add Courses
    //       </Fab>
    //     )}
    //   {otherButton && (
    //     <button
    //       onClick={() => {
    //         setOtherButton(false);
    //         coursesAddedHandler();
    //       }}
    //     >
    //       {' '}
    //       Done{' '}
    //     </button>
    //   )}
    // </div>
  );
}
