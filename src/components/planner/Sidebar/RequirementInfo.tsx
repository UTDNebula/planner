import React from 'react';
import { v4 as uuid } from 'uuid';

import useSearch from '@/components/search/search';
import { getAllCourses } from '@/modules/common/api/templates';
import { Course } from '@/modules/common/data';

import { DegreeRequirement, DraggableCourse, GetDragIdByCourseAndReq } from '../types';
import DraggableCourseList from './DraggableCourseList';
import RequirementSearchBar from './RequirementSearchBar';

export interface RequirementInfoProps {
  courses: string[];
  allUserCourses: Set<string>;
  setAddCourse: (state: boolean) => void;
  setAddPlaceholder: (state: boolean) => void;
  getCourseItemDragId: GetDragIdByCourseAndReq;
  degreeRequirement: DegreeRequirement;
}

export default function RequirementInfo({
  courses,
  allUserCourses,
  setAddCourse,
  setAddPlaceholder,
  getCourseItemDragId,
  degreeRequirement,
}: RequirementInfoProps) {
  // TODO: Make better solution to update results when carousel changes
  React.useEffect(() => {
    updateQuery('');
  }, [courses]);

  // TODO: Change this later when connecting to API
  const getCourses = async (): Promise<Course[]> => {
    const courseData = await getAllCourses();
    const temp = courses;

    const courseInfoList: (Course | undefined)[] = temp.map((elm) => {
      if (courseData[elm] !== undefined) {
        const { name, hours, description, prerequisites } = courseData[elm];
        const newCourse: Course = {
          id: uuid(),
          title: name,
          catalogCode: elm,
          description,
          creditHours: +hours,
          prerequisites: prerequisites[0], // Fix this later
          validation: { isValid: true, override: false },
        };
        return newCourse;
      }
    });
    return courseInfoList.filter((elm) => typeof elm !== 'undefined') as Course[];
  };

  // TODO: Add error UI
  const { results, updateQuery } = useSearch({
    getData: getCourses,
    initialQuery: '',
    filterFn: (elm, query) => elm['catalogCode'].toLowerCase().includes(query.toLowerCase()),
    constraints: [0, 5],
  });

  const courseResults = results.map((result) => {
    return {
      ...result,
      status: allUserCourses.has(result.catalogCode) ? 'complete' : undefined,
    };
  }) as DraggableCourse[];

  return (
    <>
      <RequirementSearchBar updateQuery={updateQuery} />
      <DraggableCourseList
        courses={courseResults}
        getDragId={(course) => getCourseItemDragId(course, degreeRequirement)}
      />
      <div className="flex flex-row text-[10px] text-[#3E61ED] gap-x-4">
        <button onClick={() => setAddCourse(true)}>+ ADD COURSE</button>
        <button onClick={() => setAddPlaceholder(true)}>+ ADD PLACEHOLDER</button>
      </div>
    </>
  );
}
