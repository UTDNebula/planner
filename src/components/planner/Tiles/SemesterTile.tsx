import { UniqueIdentifier, useDroppable } from '@dnd-kit/core';
import { FC, forwardRef } from 'react';

import { displaySemesterCode } from '@/utils/utilFunctions';
import SyncProblemIcon from '@mui/icons-material/SyncProblem';

import {
  DragDataToSemesterTile,
  DraggableCourse,
  GetDragIdByCourseAndSemester,
  Semester,
} from '../types';
import DraggableSemesterCourseItem from './SemesterCourseItem';
import { SemesterErrors } from '../Planner';

export interface SemesterTileProps {
  semester: Semester;
  isOver: boolean;
  getDragId: GetDragIdByCourseAndSemester;
  isValid: boolean;
  semesterErrors: SemesterErrors;
  onRemoveCourse: (semester: Semester, course: DraggableCourse) => void;
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
      <div className="flex flex-row justify-between">
        <div className="flex flex-row">
          <h3 className={`text-[15px] font-medium ${getTitleText({ isValid })}`}>
            {displaySemesterCode(semester.code)}
          </h3>
        </div>
        {numProblems > 0 && (
          <div
            className="tooltip tooltip-top flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white"
            data-tip={`${generateErrorMsg()}`}
          >
            {numProblems}
          </div>
        )}
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
  semesterErrors: SemesterErrors;
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
