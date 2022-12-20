import useSearch from '@/components/search/search';
import SearchBar from '@/components/search/SearchBar';
import { getAllCourses } from '@/modules/common/api/templates';
import { Course } from '@/modules/common/data';
import React from 'react';
import { DegreeRequirement } from './CourseSelectorContainer';
import DraggableCourseContainer from './DraggableCourseContainer';
import { v4 as uuid } from 'uuid';
import RequirementContainerHeader from './RequirementContainerHeader';

export default function RequirementContainer({
  data,
  setCarousel,
}: {
  data: DegreeRequirement;
  setCarousel: (state: boolean) => void;
}) {
  // TODO: Change this later when connecting to API
  const getCourses = async (): Promise<Course[]> => {
    const courseData = await getAllCourses();
    const temp = data.courses;

    const courseInfoList: Course[] = temp.map((elm) => {
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
    return courseInfoList.filter((elm) => elm !== undefined);
  };

  // TODO: Move to utils file
  const getCreditHours = (validCourses: string[]): number => {
    return validCourses.length > 0
      ? sumList(
          Object.values(
            validCourses.map((elm) => {
              return parseInt(elm.split(' ')[1].substring(1, 2));
            }),
          ),
        )
      : 0;
  };

  const sumList = (values: number[]): number => {
    return values.reduce((prev: number, curr: number) => prev + curr);
  };

  // TODO: Add error UI
  const { results, updateQuery } = useSearch({
    getData: getCourses,
    initialQuery: '',
    filterFn: (elm, query) => elm['catalogCode'].toLowerCase().includes(query.toLowerCase()),
    constraints: [0, 5],
  });

  const numCredits = getCreditHours(data.validCourses);
  const description =
    'CS guided electives are 4000 level CS courses approved by the students CS advisor. Thefollowing courses may be used as guided electives without the explicit approval of an advisor.';

  // TODO: Make better solution to update results when carousel changes
  React.useEffect(() => {
    updateQuery('');
  }, [data]);
  return (
    <>
      <RequirementContainerHeader data={data} numCredits={numCredits} setCarousel={setCarousel} />
      <div className="text-[11px]">{description}</div>
      <SearchBar updateQuery={updateQuery} />
      <DraggableCourseContainer results={results} />
    </>
  );
}
