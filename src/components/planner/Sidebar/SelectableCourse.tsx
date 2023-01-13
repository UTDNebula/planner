import React from 'react';
import { v4 as uuid } from 'uuid';

import { Course } from '@/modules/common/data';

import { DraggableCourse } from '../types';

export default function SelectableCourse({
  course,
  selected,
  selectCourse,
}: {
  course: DraggableCourse;
  selected: boolean;
  selectCourse: (course: DraggableCourse, add: boolean) => void;
}) {
  const id = uuid();

  const handleSelectCourse = () => {
    selectCourse(course, !selected);
  };

  return (
    <button
      className={`${
        selected ? 'bg-blue-500 text-white' : 'border border-[#EDEFF7] '
      } text-[10px] items-center drop-shadow-sm py-1.5 px-2 flex flex-row justify-between rounded-md`}
      key={id}
      onClick={handleSelectCourse}
    >
      {course.code}
      {course.status && (
        <div
          className={`${
            selected ? 'border-white text-white' : 'border-[#1C2A6D]'
          } flex justify-center items-center text-[11px] w-20 border rounded-md`}
        >
          {'Complete'}
        </div>
      )}
    </button>
  );
}
