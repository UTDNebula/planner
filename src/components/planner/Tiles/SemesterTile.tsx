import { Course } from '@/modules/common/data';
import { UniqueIdentifier, useDroppable } from '@dnd-kit/core';
import { FC, forwardRef } from 'react';

import { DragDataToSemesterTile, Semester } from '../types';
import DraggableSemesterCourseItem from './SemesterCourseItem';

export interface SemesterTileProps {
  semester: Semester;
  isOver: boolean;
  getDragId: (semester: Semester, c: Course) => UniqueIdentifier;
  isValid: boolean;
}

/**
 * Strictly UI implementation of a semester tile
 */
export const SemesterTile = forwardRef<HTMLDivElement, SemesterTileProps>(function SemesterTile(
  { semester, getDragId, isValid, isOver },
  ref,
) {
  return (
    <div
      ref={ref}
      className={`w-[256px] h-[184px] overflow-hidden bg-white rounded-md shadow-md px-[12px] py-[8px] flex flex-col gap-[10px] transition-all duration-300 select-none ${
        isOver ? 'shadow-lg scale-105' : ''
      } border-b-[9px] ${isValid ? 'border-b-[#3E61ED]' : 'border-b-red-500'}`}
    >
      <div className="flex justify-between">
        <h3 className={`text-[15px] font-medium ${isValid ? 'text-[#3E61ED]' : 'text-red-500'}`}>
          {semester.name}
        </h3>
        {!isValid && <h3 className="text-[15px] font-medium text-red-500">{'Invalid Course'}</h3>}
      </div>

      {semester.courses.map((course) => (
        <DraggableSemesterCourseItem
          key={course.id}
          dragId={getDragId(semester, course)}
          isValid={course.validation?.isValid === false}
          course={course}
          semester={semester}
        />
      ))}
    </div>
  );
});

export interface DroppableSemesterTileProps {
  dropId: UniqueIdentifier;
  getSemesterCourseDragId: (semester: Semester, course: Course) => UniqueIdentifier;
  semester: Semester;
  isValid: boolean;
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
  const { setNodeRef, isOver } = useDroppable({
    id: dropId,
    data: { to: 'semester-tile', semester } as DragDataToSemesterTile,
  });

  return (
    <SemesterTile
      ref={setNodeRef}
      isOver={isOver}
      semester={semester}
      getDragId={getSemesterCourseDragId}
      {...props}
    />
  );
};

export default DroppableSemesterTile;
