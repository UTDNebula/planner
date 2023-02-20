import { UniqueIdentifier, useDroppable } from '@dnd-kit/core';
import React, { FC, forwardRef, useState } from 'react';

import { displaySemesterCode } from '@/utils/utilFunctions';

import { DragDataToSemesterTile, GetDragIdByCourseAndSemester, Semester } from '../types';
import DraggableSemesterCourseItem from './SemesterCourseItem';
import { SemesterErrors } from '../Planner';
import ChevronIcon from '@/icons/ChevronIcon';
import SemesterTileDropdown from './SemesterTileDropdown';
import { useSemestersContext } from '../SemesterContext';

export interface SemesterTileProps {
  semester: Semester;
  getDragId: GetDragIdByCourseAndSemester;
  semesterErrors: SemesterErrors;
}

/**
 * Strictly UI implementation of a semester tile
 */
/* eslint-disable react/prop-types */
export const MemoizedSemesterTile = React.memo(
  forwardRef<HTMLDivElement, SemesterTileProps>(function SemesterTile(
    { semester, getDragId, semesterErrors },
    ref,
  ) {
    const [open, setOpen] = useState(true);

    const {
      handleAddSelectedCourses,
      handleRemoveSelectedCourse,
      handleDeleteAllCoursesFromSemester,
    } = useSemestersContext();

    const { sync, prerequisites } = semesterErrors;
    const { extra, missing } = sync;

    const numProblems = extra.length + missing.length + prerequisites.length;

    const generateErrorMsg = () => {
      const extraMsg = extra.length > 0 ? `Extra courses: ${extra.toString()}. ` : '';
      const missingMsg = missing.length > 0 ? `Missing courses: ${missing.toString()}. ` : '';
      const prerequisiteMsg = undefined; // TODO: Implement later

      return `Errors found in semester: ${extraMsg}${missingMsg}`;
    };

    // QUESTION: isValid color?
    return (
      <div
        ref={ref}
        className={`flex h-fit w-[369px] select-none flex-col gap-y-4 overflow-hidden rounded-2xl border border-neutral-300 bg-white py-4 px-5`}
      >
        <article className="w-full">
          <ChevronIcon
            className={`${
              open ? 'rotate-90' : '-rotate-90'
            } ml-auto h-3 w-3 transform cursor-pointer text-neutral-500 transition-all duration-500`}
            fontSize="inherit"
            onClick={() => setOpen(!open)}
          />
        </article>
        <div className="flex flex-row items-center justify-between">
          <div className="flex h-10 flex-row items-center justify-center">
            <h3 className={`text-2xl font-semibold text-primary-900`}>
              {displaySemesterCode(semester.code)}
            </h3>
          </div>

          {numProblems > 0 && (
            <div
              className="opacity-0.5 tooltip tooltip-top h-fit rounded-full text-[14px] font-medium "
              data-tip={`${generateErrorMsg()}`}
            >
              <div className="badge border-none bg-red-50 text-red-500">{numProblems} errors</div>
            </div>
          )}

          <SemesterTileDropdown
            deleteAllCourses={() => handleDeleteAllCoursesFromSemester(semester)}
            selectAllCourses={() =>
              handleAddSelectedCourses(
                semester.courses.map((course) => ({
                  courseId: course.id.toString(),
                  semesterId: semester.id.toString(),
                })),
              )
            }
          />
        </div>

        <article
          className={`flex flex-col gap-y-4 overflow-hidden transition-all duration-700 ${
            open ? 'max-h-[999px]' : 'max-h-0'
          }`}
        >
          {semester.courses.map((course) => (
            <DraggableSemesterCourseItem
              onSelectCourse={() =>
                handleAddSelectedCourses([
                  { courseId: course.id.toString(), semesterId: semester.id.toString() },
                ])
              }
              onDeselectCourse={() =>
                handleRemoveSelectedCourse({
                  courseId: course.id.toString(),
                  semesterId: semester.id.toString(),
                })
              }
              key={course.id.toString()}
              dragId={getDragId(course, semester)}
              course={course}
              semester={semester}
            />
          ))}
        </article>
      </div>
    );
  }),
);

export const SemesterTile = MemoizedSemesterTile;

export interface DroppableSemesterTileProps {
  dropId: UniqueIdentifier;
  semester: Semester;
  getSemesterCourseDragId: GetDragIdByCourseAndSemester;
  semesterErrors: SemesterErrors;
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
  const { setNodeRef } = useDroppable({
    id: dropId,
    data: { to: 'semester-tile', semester } as DragDataToSemesterTile,
  });

  return (
    <SemesterTile
      ref={setNodeRef}
      semester={semester}
      getDragId={getSemesterCourseDragId}
      {...props}
    />
  );
};

export default React.memo(DroppableSemesterTile);
