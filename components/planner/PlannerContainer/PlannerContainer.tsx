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
  updateOverride: (id: string) => void;
  addSemester: (idx: number, isSummer: boolean) => void;
  removeSemester: (index: number) => void;
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
  updateOverride,
  addSemester,
  removeSemester,
}: React.PropsWithChildren<PlannerContainerProps>) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="relative flex flex-row overflow-x-scroll">
        <CourseSelector results={results} updateQuery={updateQuery} />
        <div className="mr-80"></div>
        <div className="flex flex-row overflow-y-scroll h-full">
          {items.map((item, idx, itemArr) => {
            const potentialSemesters = { semIndex: idx, f: true, s: true, u: true };
            // Determine if you need next item in itemArr
            const currSemCode = item.code[item.code.length - 1];

            if (currSemCode === 'f') {
              potentialSemesters['u'] = false;
              potentialSemesters['f'] = false;
              if (idx + 1 < itemArr.length && itemArr[idx + 1].code.includes('s')) {
                potentialSemesters['s'] = false;
              }
            } else if (currSemCode === 's') {
              potentialSemesters['s'] = false;
              if (idx + 1 < itemArr.length) {
                if (itemArr[idx + 1].code.includes('u')) {
                  potentialSemesters['u'] = false;
                  potentialSemesters['f'] = false;
                }
                if (itemArr[idx + 1].code.includes('f')) {
                  potentialSemesters['f'] = false;
                }
              }
            } else {
              potentialSemesters['s'] = false;
              if (idx + 1 < itemArr.length && itemArr[idx + 1].code.includes('f')) {
                potentialSemesters['f'] = false;
                potentialSemesters['u'] = false;
              }
            }
            return (
              <SemesterContainer
                key={item.code}
                potentialSemesters={potentialSemesters}
                item={item}
                removeCourse={removeCourse}
                addSemester={addSemester}
                removeSemester={removeSemester}
                updateOverride={updateOverride}
              />
            );
          })}
          {children}
        </div>
      </div>
    </DragDropContext>
  );
}

export interface RecentSemester {
  year: number;
  semester: SemesterCode;
}
