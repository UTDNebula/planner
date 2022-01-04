import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Course, Semester, SemesterCode } from '../../../modules/common/data';
import { reorderList } from '../../../modules/planner/hooks/planManipulatorUtils';
import CourseCard from '../../common/CourseCard';
import AddSemesterTrigger from '../AddSemesterTrigger';

interface DraggableItemContainerProps<T> {
  items: Semester[];
  onDragEnd: (result: DropResult) => void;
}

/**
 * A container for lists of draggable items that can be moved between them.
 *
 * This is used to hold semester informaiton and renders courses accordingly.
 *
 * TODO(planner): Finalize abstraction and make separate semester-specific DraggableItemContainer.
 */
export default function DraggableItemContainer<T>({
  items,
  onDragEnd,
  children,
}: React.PropsWithChildren<DraggableItemContainerProps<T>>) {
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

export function useDraggableItemContainer(
  items: Semester[],
  onPersistChanges: (data: {
    semesters: Record<string, Semester>;
    // allItems: Array<Course>,
  }) => void,
) {
  const [lists, setLists] = React.useState<{
    semesters: Record<string, Semester>;
    // allItems: Array<Course>,
  }>({
    semesters: items.reduce((acc, semester) => {
      acc[semester.code] = semester;
      return acc;
    }, {}),
    // allItems: [],
  });

  // Determines whether or not to persist changes
  const [temp, setTemp] = React.useState<boolean>(false);

  const addItemToList = (itemId: string, listId: string) => {
    const semesters = lists.semesters;
    // TODO: Implement me
    setLists({
      semesters,
    });
    if (!temp) {
      onPersistChanges(lists);
    }
  };

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

    if (!temp) {
      onPersistChanges(lists);
    }
  };

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
    if (!temp) {
      onPersistChanges(lists);
    }
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
    if (!temp) {
      onPersistChanges(lists);
    }
  };

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
    if (!temp) {
      onPersistChanges(lists);
    }
  }, [lists]);

  const addList = (newList: Semester, id: string) => {
    setLists({
      semesters: {
        ...lists.semesters,
        [id]: newList,
      },
    });
  };

  const semesters = Object.entries(lists.semesters).map(([_, semester]) => semester);

  return {
    addItemToList,
    updateSemesters,
    removeItemFromList,
    moveItem,
    addList,
    handleOnDragEnd,
    setTemp,
    semesters,
    lists,
  };
}
