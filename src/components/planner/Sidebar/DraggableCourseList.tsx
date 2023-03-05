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
    <div className="flex flex-col gap-y-4 bg-white text-[#757575]">
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

export default React.memo(DraggableCourseList);
