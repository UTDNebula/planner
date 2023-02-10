import { ObjectID } from 'bson';
import React from 'react';

import useSearch from '@/components/search/search';

import { DegreeRequirement, DraggableCourse, GetDragIdByCourseAndReq } from '../types';
import DraggableCourseList from './DraggableCourseList';
import RequirementSearchBar from './RequirementSearchBar';
import { trpc } from '@/utils/trpc';

export interface RequirementInfoProps {
  courses: string[];
  validCourses: string[];
  allUserCourses: string[];
  setAddCourse: (state: boolean) => void;
  setAddPlaceholder: (state: boolean) => void;
  getCourseItemDragId: GetDragIdByCourseAndReq;
  degreeRequirement: DegreeRequirement;
}

export default function RequirementInfo({
  courses,
  validCourses,
  allUserCourses,
  setAddPlaceholder,
  getCourseItemDragId,
  degreeRequirement,
}: RequirementInfoProps) {
  // TODO: Make better solution to update results when carousel changes

  const q = trpc.courses.publicGetAllCourses.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const { isLoading } = q;

  React.useEffect(() => {
    updateQuery('');
  }, [courses, isLoading]);

  // TODO: Change this later when connecting to API
  const getCourses = async (): Promise<DraggableCourse[]> => {
    const courseData = q.data
      ? q.data.reduce((acc, curr) => {
          acc[`${curr.subject_prefix} ${curr.course_number}`] = curr;
          return acc;
        }, {} as Record<string, typeof q.data[0]>)
      : {};
    const temp = courses;
    validCourses.forEach((course) => {
      if (!temp.includes(course)) {
        temp.push(course);
      }
    });

    const courseInfoList: (DraggableCourse | undefined)[] = temp.map((elm) => {
      // if (courseData[elm] !== undefined) {
      const newCourse: DraggableCourse = {
        id: new ObjectID(),
        code: elm,
        validation: { isValid: true, override: false },
      };
      return newCourse;
      //   }
    });
    return courseInfoList.filter((elm) => typeof elm !== 'undefined') as DraggableCourse[];
  };

  // TODO: Add error UI
  const { results, updateQuery } = useSearch({
    getData: getCourses,
    initialQuery: '',
    filterFn: (elm, query) => elm['code'].toLowerCase().includes(query.toLowerCase()),
    constraints: [0, 1000],
  });

  console.log(results);
  const courseResults = results.map((result) => {
    return {
      ...result,
      status: validCourses.includes(result.code) ? 'complete' : undefined,
      taken: allUserCourses.includes(result.code),
    };
  }) as DraggableCourse[];

  return (
    <>
      <RequirementSearchBar updateQuery={updateQuery} />
      <DraggableCourseList
        courses={courseResults}
        getDragId={(course) => getCourseItemDragId(course, degreeRequirement)}
      />
      <div className="flex flex-row gap-x-4 text-[10px] text-[#3E61ED]">
        <button onClick={() => setAddPlaceholder(true)}>+ ADD COURSE NOT HERE</button>
      </div>
    </>
  );
}
