import { UniqueIdentifier } from '@dnd-kit/core';
import React, { memo } from 'react';

import DraggableSidebarCourseItem from './SidebarCourseItem';
import { DraggableCourse } from '../types';

export interface DraggableCourseListProps {
  courses: DraggableCourse[];
  getDragId: (course: DraggableCourse) => UniqueIdentifier;
}

function DraggableCourseList({ courses, getDragId }: DraggableCourseListProps) {
  // Add sorting logic here
  return (
    <div className="flex max-h-64 flex-col gap-y-4 overflow-scroll bg-white text-[#757575]">
      {courses.length > 0 ? (
        courses.map((course, idx) => (
          <DraggableSidebarCourseItem dragId={getDragId(course)} key={idx} course={course} />
        ))
      ) : (
        <p>No courses found.</p>
      )}
    </div>
  );
}

export default memo(DraggableCourseList);
