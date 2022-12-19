import { UniqueIdentifier, useDroppable } from '@dnd-kit/core';
import { FC, forwardRef, useCallback } from 'react';

import { Course, DragDataToSemesterTile, Semester } from './Planner';
import DraggableSemesterCourseItem from './SemesterCourseItem';

export interface SemesterTileProps {
  semester: Semester;
  isOver: boolean;
  getDraggableId: (c: Course) => UniqueIdentifier;
  isValid: boolean;
}

/**
 * Strictly UI implementation of a semester tile
 */
export const SemesterTile = forwardRef<HTMLDivElement, SemesterTileProps>(function SemesterTile(
  { semester, getDraggableId, isValid },
  ref,
) {
  return (
    <div
      ref={ref}
      className={`w-[256px] h-[184px] bg-white rounded-md shadow-md px-[12px] py-[8px] flex flex-col gap-[10px] border-b-[9px] ${
        isValid ? 'border-[#3E61ED]' : 'border-red-500'
      }`}
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
          id={getDraggableId(course)}
          isValid={course.validation?.isValid === false}
          course={course}
          semester={semester}
        />
      ))}
    </div>
  );
});

export interface DroppableSemesterTileProps {
  id: UniqueIdentifier;
  semester: Semester;
  isValid: boolean;
}

/**
 * Strictly compositional wrapper around SemesterTile
 */
const DroppableSemesterTile: FC<DroppableSemesterTileProps> = ({ id, semester, ...props }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { to: 'semester-tile', semester } as DragDataToSemesterTile,
  });

  // ensure no two courses have same id among different semesters
  const getDraggableId = useCallback((course: Course) => `${semester.id}-${course.id}`, [semester]);

  return (
    <SemesterTile
      ref={setNodeRef}
      isOver={isOver}
      semester={semester}
      getDraggableId={getDraggableId}
      {...props}
    />
  );
};

export default DroppableSemesterTile;
