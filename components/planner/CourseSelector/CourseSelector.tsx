import Alert from '@mui/material/Alert';
import React, { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import DummyData from '../../../data/dummy_planner_course_data.json';
import { Course } from '../../../modules/common/data';
import SearchBar from '../../search/SearchBar';
import { Card } from './Card';

export type CourseSelectedAction = 'Add' | 'Remove';

function errorMessage() {
  return <Alert severity="error">Something went wrong - please try again!</Alert>;
}

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
 * 1. Figure out CourseSelector functionality & refactor
 * 2. Add course validation
 *  - this means graying out courses that are already on planner
 * 3. Properly style CardContainer
 */

/**
 * Sidebar that allows the user to add courses to their degree plan
 */
export default function CourseSelector({ results, updateQuery }: CourseSelectorProps) {
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

  const addUserCourses = (addCourses: Course[]) => {
    // TODO: Put these courses inside pre-existing categories if possible
    console.debug('shit added');
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
    <div className="flex flex-col overflow-hidden items-center min-h-[100vh] mx-4 max-h-[100vh] min-w-[20rem] max-w-[20rem] p-0 mt-2 overflow-y-scroll">
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
                      className="mx-1"
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Card key={elm.id} props={elm} toggleCourseSelected={toggleCourseSelected} />
                    </div>
                  )}
                </Draggable>
              );
            })}
            <div className="w-[19rem] h-10"></div>
            {results.length == 0 ? errorMessage() : provided.placeholder}
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
