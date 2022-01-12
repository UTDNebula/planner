import React, { useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import {
  Course,
  Semester,
  SemesterCode,
  SEMESTER_CODE_MAPPINGS,
} from '../../../modules/common/data';
import { reorderList } from '../../../modules/planner/hooks/planManipulatorUtils';
import CourseCard from '../../common/CourseCard';

interface DraggableItemContainerProps {
  items: Semester[];
  onDragEnd: (result: DropResult) => void;
}

/**
 * A container for lists of draggable items that can be moved between them.
 *
 * This is used to hold semester informaiton and renders courses accordingly.
 *
 */
export default function DraggableItemContainer({
  items,
  onDragEnd,
  children,
}: React.PropsWithChildren<DraggableItemContainerProps>) {
  const listItems = items.map((item) => {
    return (
      <Droppable key={item.code} droppableId={item.code}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            className="inline-block h-full w-[344px]"
            {...provided.droppableProps}
          >
            <div className="m-2 p-2 bg-white rounded-md border-gray-200 border-2">{item.title}</div>
            <div>
              {item.courses.map(({ id, title, catalogCode, description, creditHours }, index) => {
                return (
                  <Draggable key={id} draggableId={id} index={index}>
                    {(provided) => (
                      <CourseCard
                        key={catalogCode}
                        ref={provided.innerRef}
                        code={catalogCode}
                        title={title}
                        description={description}
                        creditHours={creditHours}
                        enabled
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      />
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    );
  });

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="h-full p-8 flex flex-nowrap overflow-x-auto">
        {listItems}
        {children}
      </div>
    </DragDropContext>
  );
}

export interface RecentSemester {
  year: number;
  semester: SemesterCode;
}

/**
 * Generate metadata for adding a new semester.
 *
 * @param onlyLong Whether or not to only output long (fall/spring) semesters.
 */
export function getUpdatedSemesterData(recentSemesterData: RecentSemester, onlyLong = true) {
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

/**
 * This function generates the metadata needed
 * create a new semester inside the user plan
 * @param semesters Array of semesters obtained from the user plan
 * @returns metatdata to create a new semester
 */
export function getRecentSemesterMetadata(semesters: Semester[]) {
  const lastSemester: Semester = semesters[semesters.length - 1];
  const recentSemester: RecentSemester = {
    year: parseInt(lastSemester.code.substring(0, lastSemester.code.length - 1)),
    semester: lastSemester.code.substring(lastSemester.code.length - 1) as SemesterCode,
  };
  return recentSemester;
}

/**
 * A hook that manages the state of the degree planner component.
 *
 * @param items Array of semesters obtained from the user plan
 * @param onPersistChanges Function that saves the planner state across sessions (currently localStorage)
 *
 * @returns 'plans' which holds the planner state, as well as multiple utility functions
 * Information about each function is documented inside the hook.
 */
export function useDraggableItemContainer(
  items: Semester[],
  onPersistChanges: (data: { semesters: Record<string, Semester> }) => void,
) {
  // Object mapping semester code to each semester
  // Used to maange state of the degree planner
  // Warning: Do NOT use lists to get user semesters; use semesters instead
  const [lists, setLists] = React.useState<{
    semesters: Record<string, Semester>;
  }>({
    semesters: items.reduce((acc, semester) => {
      acc[semester.code] = semester;
      return acc;
    }, {}),
  });

  // Array of semesters (use this whenever you need to get user semesters)
  const semesters = Object.entries(lists.semesters).map(([_, semester]) => semester);

  // Controls whether or not to persist changes
  const [persist, setPersist] = React.useState<boolean>(true);

  /* These variables and functions handle adding courses into the degree plan */

  // Array of courses that the user plans on adding
  const [coursesToAdd, setCoursesToAdd] = React.useState<Course[]>([]);

  // Controls whether or not to show Droppable for adding courses
  const [showAddCourseDroppable, setShowAddCourseDroppable] = React.useState(false);

  /**
   * Runs whenever an event to add courses to the planner is called
   *
   * @param CoursesToAdd Array of courses that the user wants to add
   *
   * Note: changes are NOT persisted until {@link coursesAddedHandler} is called
   */
  const coursesToAddHandler = (CoursesToAdd: Course[]) => {
    setCoursesToAdd(CoursesToAdd);
    setShowAddCourseDroppable(true);
    setPersist(false);
  };

  /**
   * Runs whenver an event to finish adding courses to the planner is called
   */
  const coursesAddedHandler = () => {
    console.log('Courses have been added');
    setCoursesToAdd([]);
    setShowAddCourseDroppable(false);
    setPersist(true);
  };

  /**
   * This adds the Droppable for adding courses into the DraggableItemContainer
   */
  React.useEffect(() => {
    const tempSemester: Semester = {
      title: 'Add courses to degree plan here',
      code: 'Add',
      courses: coursesToAdd,
    };
    showAddCourseDroppable
      ? updateSemesters([tempSemester, ...semesters])
      : updateSemesters(semesters.filter((elm) => elm.code !== 'Add'));
  }, [showAddCourseDroppable]);

  /**
   * Allows users to add an additional semester to their schedule
   */
  const addSemester = () => {
    const recentSemester = getRecentSemesterMetadata(semesters);
    const { year, semester } = getUpdatedSemesterData(recentSemester);

    const newSemester: Semester = {
      title: `${SEMESTER_CODE_MAPPINGS[semester]} ${year}`,
      code: (year + semester.toString()).toString(),
      courses: [],
    };
    updateSemesters([...semesters, newSemester]);
    // if (persist) {
    //   onPersistChanges(lists);
    // }
  };

  /**
   * Allows users to remove a semester from their schedule
   * Does not run if the user only has one semester
   */
  const removeSemester = () => {
    if (semesters.length > 1) {
      updateSemesters(semesters.slice(0, semesters.length - 1));
    }
    // if (persist) {
    //   onPersistChanges(lists);
    // }
  };

  /**
   * Not used; {@link coursesToAddHandler} and {@link coursesAddedHandler}
   * have implemented the functionality of this function
   */
  const addItemToList = (itemId: string, listId: string) => {
    const semesters = lists.semesters;
    // TODO: Implement me
    setLists({
      semesters,
    });
    // if (persist) {
    //   onPersistChanges(lists);
    // }
  };

  /**
   * Allows users to remove courses from their schedule
   * NOT IMPLEMENTED YET
   * @param itemId
   * @param listId
   */
  const removeItemFromList = (itemId: string, listId: string) => {
    // TODO: Find in list
    // TODO: Use setLists to remove
    const semesters = lists.semesters;
    const semester = semesters[listId];
    const courseIndex = semester.courses.findIndex(({ id }) => id === itemId);
    delete semester.courses[courseIndex];
    semesters[listId] = semester;

    setLists({
      semesters,
    });

    // if (persist) {
    //   onPersistChanges(lists);
    // }
  };

  /**
   * Updates courses inside a semester after a drag and drop event is called
   * Is called only when a course's starting and ending position is the same semester
   * @param sourceSemester original semester
   * @param sourceIndex original index of course
   * @param destinationIndex final index of course
   * @param sourceId semester Droppable id
   */
  const updateSemester = (
    sourceSemester: Semester,
    sourceIndex: number,
    destinationIndex: number,
    sourceId: string,
  ) => {
    const items = reorderList<Course>(sourceSemester.courses, sourceIndex, destinationIndex);
    const newSemesters = lists.semesters;
    newSemesters[sourceId] = {
      ...sourceSemester,
      courses: items,
    };
    setLists({
      semesters: newSemesters,
    });
    // if (persist) {
    //   onPersistChanges(lists);
    // }
  };

  /**
   * Moves an item between lists.
   *
   * @param itemId The ID of the item to move
   * @param startListId The source of the item
   * @param endListId The destination for the item
   */
  const moveItem = (
    sourceSemester: Semester,
    destinationSemester: Semester,
    sourceIndex: number,
    destinationIndex: number,
    sourceId: string,
    destinationId: string,
  ) => {
    const clonedSource = Array.from(sourceSemester.courses);
    const clonedDestination = Array.from(destinationSemester.courses);
    const [removed] = clonedSource.splice(sourceIndex, 1);

    // Move the course to the destination list
    clonedDestination.splice(destinationIndex, 0, removed);

    const newSemesters = lists.semesters;

    // Update the source semester's courses
    newSemesters[sourceId] = {
      ...sourceSemester,
      courses: clonedSource,
    };

    // Update the destination semester's courses
    newSemesters[destinationId] = {
      ...destinationSemester,
      courses: clonedDestination,
    };

    setLists({
      semesters: newSemesters,
    });
    // if (persist) {
    //   onPersistChanges(lists);
    // }
  };

  /**
   * Called on the end of each drag and drop event
   * @param param0
   * @returns
   */
  const handleOnDragEnd = ({ source, destination }: DropResult) => {
    if (destination) {
      const sourceId = source.droppableId;
      const destinationId = destination.droppableId;
      const sourceIndex = source.index;
      const destinationIndex = destination.index;

      if (sourceId === destinationId && destinationIndex === sourceIndex) {
        return;
      }

      const sourceSemester = lists.semesters[sourceId];
      const destinationSemester = lists.semesters[destinationId];
      if (sourceId === destinationId) {
        updateSemester(sourceSemester, sourceIndex, destinationIndex, sourceId);
      } else {
        moveItem(
          sourceSemester,
          destinationSemester,
          sourceIndex,
          destinationIndex,
          sourceSemester.code,
          destinationSemester.code,
        );
      }
    }
  };
  /**
   * Reinitialize the semesters using the given list.
   */
  const updateSemesters = (newSemesters: Semester[]) => {
    setLists({
      semesters: newSemesters.reduce((acc, semester) => {
        acc[semester.code] = semester;
        return acc;
      }, {}),
    });
  };

  // Ensures that planner updates after "DONE" is selected
  React.useEffect(() => {
    if (persist) {
      onPersistChanges(lists);
    }
  }, [lists]);

  return {
    addSemester,
    removeSemester,
    addItemToList,
    updateSemesters,
    removeItemFromList,
    moveItem,
    handleOnDragEnd,
    setPersist,
    coursesToAddHandler,
    coursesAddedHandler,
    showAddCourseDroppable,
    semesters,
    lists,
  };
}
