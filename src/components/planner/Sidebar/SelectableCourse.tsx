import React from 'react';
import { v4 as uuid } from 'uuid';

import { PlanCourse } from '../types';

export default function SelectableCourse({
  course,
  selected,
  selectCourse,
}: {
  course: PlanCourse;
  selected: boolean;
  selectCourse: (course: PlanCourse, add: boolean) => void;
}) {
  const id = uuid();

  const handleSelectCourse = () => {
    selectCourse(course, !selected);
  };

  return (
    <button
      className={`${
        selected ? 'bg-blue-500 text-white' : 'border border-[#EDEFF7] '
      } flex flex-row items-center justify-between rounded-md py-1.5 px-2 text-[10px] drop-shadow-sm`}
      key={id}
      onClick={handleSelectCourse}
    >
      {course.code}
      {course.status && (
        <div
          className={`${
            selected ? 'border-white text-white' : 'border-[#1C2A6D]'
          } flex w-20 items-center justify-center rounded-md border text-[11px]`}
        >
          {'Complete'}
        </div>
      )}
    </button>
  );
}
