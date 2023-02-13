import { UniqueIdentifier, useDroppable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { FC, forwardRef } from 'react';

import { displaySemesterCode } from '@/utils/utilFunctions';
import SyncProblemIcon from '@mui/icons-material/SyncProblem';

import { DragDataToSemesterTile, PlanCourse, GetDragIdByCourseAndSemester, PlanId } from '../types';
import DraggableSemesterCourseItem from './SemesterCourseItem';
import { SemesterErrors } from '../Planner';

export interface SemesterTileProps {
  semester: PlanId;
  isOver: boolean;
  getDragId: GetDragIdByCourseAndSemester;
  isValid: boolean;
  semesterErrors: SemesterErrors;
  onRemoveCourse: (semester: PlanId, course: PlanCourse) => void;
}

function getTitleText({ isValid }: { isValid: boolean }) {
  return isValid ? 'text-[#3E61ED]' : 'text-red-500';
}
/**
 * Strictly UI implementation of a semester tile
 */
export const SemesterTile = forwardRef<HTMLDivElement, SemesterTileProps>(function SemesterTile(
  { semester, getDragId, isValid, isOver, semesterErrors, onRemoveCourse },
  ref,
) {
  const { sync, prerequisites } = semesterErrors;
  const { extra, missing } = sync;

  const numProblems = extra.length + missing.length + prerequisites.length;

  const generateErrorMsg = () => {
    const extraMsg = extra.length > 0 ? `Extra courses: ${extra.toString()}. ` : '';
    const missingMsg = missing.length > 0 ? `Missing courses: ${missing.toString()}. ` : '';
    const prerequisiteMsg = undefined; // TODO: Implement later

    return `Errors found in semester: ${extraMsg}${missingMsg}`;
  };

  return (
    <div
      ref={ref}
      className={`flex max-h-full min-h-[184px] w-[256px] select-none flex-col gap-[10px] rounded-md bg-white px-[12px] py-[8px] shadow-md transition-all duration-300 ${
        isOver ? 'scale-105 shadow-lg' : ''
      } border-b-[9px] ${isValid ? 'border-b-[#3E61ED]' : 'border-b-red-500'}`}
    >
      <div className="flex flex-row items-center justify-between">
        <div className="flex h-10 flex-row items-center justify-center">
          <h3 className={`text-[16px] font-medium ${getTitleText({ isValid })}`}>
            {displaySemesterCode(semester.code)}
          </h3>
        </div>

        {numProblems > 0 && (
          <div
            className="opacity-0.5 tooltip tooltip-top h-fit rounded-full bg-[#FEF2F2] px-3 text-[14px] font-medium text-[#EF4444]"
            data-tip={`${generateErrorMsg()}`}
          >
            {numProblems} errors
          </div>
        )}
        {!isValid && <h3 className="text-[15px] font-medium text-red-500">{'Invalid Course'}</h3>}
      </div>

      <SortableContext items={semester.courses.map((course) => getDragId(course, semester))}>
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
      </SortableContext>
    </div>
  );
});

export interface DroppableSemesterTileProps {
  dropId: UniqueIdentifier;
  semester: PlanId;
  getSemesterCourseDragId: GetDragIdByCourseAndSemester;
  isValid: boolean;
  semesterErrors: SemesterErrors;
  onRemoveCourse: (semester: PlanId, course: PlanCourse) => void;
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
