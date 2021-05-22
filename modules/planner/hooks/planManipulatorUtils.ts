import { DraggableLocation } from 'react-beautiful-dnd';

/**
 * Move a course between semesters.
 *
 * @param source
 * @param destination
 * @param droppableSource
 * @param droppableDestination
 */
export function moveDroppableCourse<T>(
  source: Array<T>,
  destination: Array<T>,
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation,
): DroppableCourseData<T> {
  const clonedSource = Array.from(source);
  const clonedDestination = Array.from(destination);
  const [removed] = clonedSource.splice(droppableSource.index, 1);

  clonedDestination.splice(droppableDestination.index, 0, removed);

  return {
    [droppableSource.droppableId]: clonedSource,
    [droppableDestination.droppableId]: clonedDestination,
  };
}

type DroppableCourseData<T> = {
  [droppableSourceId: string]: Array<T>;
};

/**
 * Move the item at the given start index to the given end index.
 *
 * @param courses The semester to reorder
 * @param startIndex The starting index of the item to move
 * @param endIndex The destination index of the item to move
 */
export function reorderSemester(courses: string[], startIndex: number, endIndex: number): string[] {
  const result = Array.from(courses);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}
