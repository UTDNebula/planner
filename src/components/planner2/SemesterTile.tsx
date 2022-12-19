import { UniqueIdentifier, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FC, forwardRef, useCallback } from 'react';

import { Course, DragDataToSemesterTile, Semester } from './Planner';
import DraggableSemesterCourseItem from './SemesterCourseItem';

export interface SemesterTileProps {
  semester: Semester;
  isOver: boolean;
  getDraggableId: (c: Course) => UniqueIdentifier;
}

/**
 * Strictly UI implementation of a semester tile
 */
export const SemesterTile = forwardRef<HTMLDivElement, SemesterTileProps>(function SemesterTile(
  { semester, getDraggableId },
  ref,
) {
  return (
    <div
      ref={ref}
      className={`w-[256px] h-[184px] bg-white rounded-md shadow-md px-[12px] py-[8px] flex flex-col gap-[10px] border-b-[9px] border-[#3E61ED]`}
    >
      <h3 className="text-[15px] font-medium text-[#3E61ED]">{semester.name}</h3>
      {semester.courses.map((course) => (
        <DraggableSemesterCourseItem
          key={course.id}
          id={getDraggableId(course)}
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
}

/**
 * Strictly compositional wrapper around SemesterTile
 */
const DroppableSemesterTile: FC<DroppableSemesterTileProps> = ({ id, semester }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { to: 'semester-tile', semester } as DragDataToSemesterTile,
  });

  // ensure no two courses have same id among different semesters
  const getDraggableId = useCallback((course: Course) => `${semester.id}-${course.id}`, [semester]);

  return (
    <SortableContext
      items={semester.courses.map(getDraggableId)}
      strategy={verticalListSortingStrategy}
    >
      <SemesterTile
        ref={setNodeRef}
        isOver={isOver}
        semester={semester}
        getDraggableId={getDraggableId}
      />
    </SortableContext>
  );
};

export default DroppableSemesterTile;
