import { UniqueIdentifier } from '@dnd-kit/core';
import React from 'react';

import DraggableSidebarCourseItem from './SidebarCourseItem';

export interface DraggableCourseListProps {
  courses: Course[];
  getDragId: (course: Course) => UniqueIdentifier;
}

function DraggableCourseList({ courses, getDragId }: DraggableCourseListProps) {
  // Add sorting logic here
  return (
    <div className="flex flex-col gap-y-4 bg-white text-[#757575]">
      {courses.map((course, idx) => (
        <DraggableSidebarCourseItem key={idx} course={{ ...course, dragId: getDragId(course) }} />
      ))}
    </div>
  );
}

export default React.memo(DraggableCourseList);
