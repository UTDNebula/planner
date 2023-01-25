import { UniqueIdentifier } from '@dnd-kit/core';
import React from 'react';

import { DraggableCourse } from '../types';
import DraggableSidebarCourseItem from './SidebarCourseItem';

export interface DraggableCourseListProps {
  courses: DraggableCourse[];
  getDragId: (course: DraggableCourse) => UniqueIdentifier;
}

function DraggableCourseList({ courses, getDragId }: DraggableCourseListProps) {
  // Add sorting logic here
  return (
    <div className="bg-white flex flex-col gap-y-4 text-[#757575]">
      {courses.map((course, idx) => (
        <DraggableSidebarCourseItem dragId={getDragId(course)} key={idx} course={course} />
      ))}
    </div>
  );
}

export default React.memo(DraggableCourseList);
