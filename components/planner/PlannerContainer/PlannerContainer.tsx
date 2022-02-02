import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Semester, SemesterCode } from '../../../modules/common/data';
import CourseSelector from '../CourseSelector';
import React from 'react';
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
