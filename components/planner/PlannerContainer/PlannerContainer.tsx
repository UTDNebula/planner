import React from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

import { Semester, SemesterCode } from '../../../modules/common/data';
import CourseSelector from '../CourseSelector';
import SemesterContainer from '../Semester/SemesterContainer';

interface PlannerContainerProps {
  items: Semester[];
  onDragEnd: (result: DropResult) => void;
  results: any[];
  updateQuery: (query: string) => void;
  removeCourse: (courseId: string, droppableId: string) => void;
}

/**
 * A container for lists of draggable items that can be moved between them.
 *
 * This is used to hold semester informaiton and renders courses accordingly.
 *
 */
export default function PlannerContainer({
  items,
  onDragEnd,
  results,
  updateQuery,
  children,
  removeCourse,
}: React.PropsWithChildren<PlannerContainerProps>) {
  items.map((item) => {
    console.log(item);
  });
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="relative flex flex-row overflow-x-scroll">
        <CourseSelector results={results} updateQuery={updateQuery} />
        {items.map((item) => (
          <SemesterContainer key={item.code} item={item} removeCourse={removeCourse} />
        ))}
        {children}
      </div>
    </DragDropContext>
  );
}

export interface RecentSemester {
  year: number;
  semester: SemesterCode;
}
