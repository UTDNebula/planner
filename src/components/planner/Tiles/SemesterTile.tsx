import { UniqueIdentifier, useDroppable } from '@dnd-kit/core';
import { FC, forwardRef } from 'react';

import { getFirstNewSemester, isEarlierSemester } from '@/utils/plannerUtils';
import { displaySemesterCode } from '@/utils/utilFunctions';

import {
  DragDataToSemesterTile,
  DraggableCourse,
  GetDragIdByCourseAndSemester,
  Semester,
} from '../types';
import DraggableSemesterCourseItem from './SemesterCourseItem';

export interface SemesterTileProps {
  semester: Semester;
  isOver: boolean;
  getDragId: GetDragIdByCourseAndSemester;
  isValid: boolean;
  isDisabled: boolean;
  onRemoveCourse: (semester: Semester, course: DraggableCourse) => void;
}

function getTitleText({ isValid, isDisabled }: { isValid: boolean; isDisabled: boolean }) {
  if (isDisabled) {
    return 'text-gray-600';
  }
  return isValid ? 'text-[#3E61ED]' : 'text-red-500';
}
/**
 * Strictly UI implementation of a semester tile
 */
export const SemesterTile = forwardRef<HTMLDivElement, SemesterTileProps>(function SemesterTile(
  { semester, getDragId, isDisabled, isValid, isOver, onRemoveCourse },
  ref,
) {
  return (
    <div
      ref={ref}
      className={`w-[256px] h-full overflow-hidden ${
        isDisabled ? 'bg-gray-100' : 'bg-white'
      } rounded-md shadow-md px-[12px] py-[8px] flex flex-col gap-[10px] transition-all duration-300 select-none ${
        isOver ? 'shadow-lg scale-105' : ''
      } border-b-[9px] ${isValid ? 'border-b-[#3E61ED]' : 'border-b-red-500'}`}
    >
      <div className="flex justify-between">
        <h3 className={`text-[15px] font-medium ${getTitleText({ isValid, isDisabled })}`}>
          {displaySemesterCode(semester.code)}
        </h3>
        {!isValid && <h3 className="text-[15px] font-medium text-red-500">{'Invalid Course'}</h3>}
      </div>

      {semester.courses.map((course) => (
        <DraggableSemesterCourseItem
          key={course.id.toString()}
          dragId={getDragId(course, semester)}
          isValid={course.validation?.isValid === false}
          course={course}
          semester={semester}
          onRemove={(course) => onRemoveCourse(semester, course)}
        />
      ))}
    </div>
  );
});

export interface DroppableSemesterTileProps {
  dropId: UniqueIdentifier;
  semester: Semester;
  getSemesterCourseDragId: GetDragIdByCourseAndSemester;
  isValid: boolean;
  onRemoveCourse: (semester: Semester, course: DraggableCourse) => void;
}

/**
 * Strictly compositional wrapper around SemesterTile
 */
const DroppableSemesterTile: FC<DroppableSemesterTileProps> = ({
  dropId,
  semester,
  getSemesterCourseDragId,
  ...props
}) => {
  const isDisabled = isEarlierSemester(semester.code, getFirstNewSemester());
  const { setNodeRef, isOver } = useDroppable({
    id: dropId,
    data: { to: 'semester-tile', semester } as DragDataToSemesterTile,
    disabled: isDisabled,
  });

  return (
    <SemesterTile
      ref={setNodeRef}
      isDisabled={isDisabled}
      isOver={isOver}
      semester={semester}
      getDragId={getSemesterCourseDragId}
      {...props}
    />
  );
};

export default DroppableSemesterTile;
