import { UniqueIdentifier, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FC, forwardRef } from 'react';

import { DragDataToSemesterTile, Semester } from './Planner';
import DraggableSemesterCourseItem from './SemesterCourseItem';

interface SemesterTileProps {
  semester: Semester;
  isOver: boolean;
}

const SemesterTile = forwardRef<HTMLDivElement, SemesterTileProps>(function SemesterTile(
  { semester, isOver },
  ref,
) {
  return (
    <div
      ref={ref}
      className={`w-[256px] h-[184px] bg-white border-2 rounded-md ${
        isOver ? 'border-black' : 'border-slate-300'
      }`}
    >
      <SortableContext items={semester.courses} strategy={verticalListSortingStrategy}>
        <div className="w-full h-full">
          <h3 className="text-[12px] font-medium">{semester.name}</h3>
          <ul>
            {semester.courses.map((course) => (
              <DraggableSemesterCourseItem
                key={course.id}
                id={course.id}
                course={course}
                semester={semester}
              />
            ))}
          </ul>
        </div>
      </SortableContext>
    </div>
  );
});

export interface DroppableSemesterTileProps {
  id: UniqueIdentifier;
  semester: Semester;
}

const DroppableSemesterTile: FC<DroppableSemesterTileProps> = ({ id, semester }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { to: 'semester-tile', semester } as DragDataToSemesterTile,
  });

  return <SemesterTile ref={setNodeRef} isOver={isOver} semester={semester} />;
};

export default DroppableSemesterTile;
