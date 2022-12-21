import useSearch, { SearchReturn } from '@/components/search/search';
import SearchBar from '@/components/search/SearchBar';
import { getAllCourses } from '@/modules/common/api/templates';
import { Course } from '@/modules/common/data';
import React from 'react';
import { DegreeRequirement } from './CourseSelectorContainer';
import DraggableCourseContainer from './DraggableCourseContainer';
import { v4 as uuid } from 'uuid';
import RequirementContainerHeader from './RequirementContainerHeader';
import { loadDummyCourses } from '@/modules/common/api/courses';
import SelectableCourseContainer from './SelectableCourseContainer';

export default function RequirementContainer({
  data,
  setCarousel,
}: {
  data: DegreeRequirement;
  setCarousel: (state: boolean) => void;
}) {
  const [addCourse, setAddCourse] = React.useState<boolean>(false);

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

  // TODO: Clean this logic up hella xD
  const { results: results2, updateQuery: updateQuery2 }: SearchReturn<Course, string> = useSearch({
    getData: loadDummyCourses,
    initialQuery: '',
    filterFn: (elm, query) => elm['catalogCode'].toLowerCase().includes(query.toLowerCase()),
    constraints: [0, 5],
  });

  // Include tag rendering information here (yes for tag & which tag)
  // TODO: Obviously have a better way of computing all courses user has taken
  // Idea is allCourses will be available as context or props or smthn
  const allCourses = new Set();

  // Get all courses user has taken
  data.validCourses.forEach((course) => {
    allCourses.add(course);
  });

  const courseResults = results.map((result) => {
    return { ...result, status: allCourses.has(result.catalogCode) ? 'Complete' : '' };
  });

  const courseResults2 = results2.map((result) => {
    return { ...result, status: allCourses.has(result.catalogCode) ? 'Complete' : '' };
  });

  const numCredits = getCreditHours(data.validCourses);
  const description = data.description ?? '';

  // TODO: Make better solution to update results when carousel changes
  React.useEffect(() => {
    updateQuery('');
  }, [data]);

  const [selectedCourses, setSelectedCourses] = React.useState<{ [key: string]: Course }>({});

  const updateSelectedCourses = (course: Course, add: boolean) => {
    const modifySelectedCourses = { ...selectedCourses };
    add
      ? (modifySelectedCourses[course.catalogCode] = course)
      : delete modifySelectedCourses.course.catalogCode;
    setSelectedCourses(modifySelectedCourses);
  };

  const handleCancel = () => {
    setSelectedCourses({});
    setAddCourse(false);
  };

  const handleSubmit = () => {
    // TODO: Update DegreeRequirementsGroup here
    console.log(selectedCourses);
    setSelectedCourses({});
    setAddCourse(false);
  };
  return (
    <>
      <RequirementContainerHeader data={data} numCredits={numCredits} setCarousel={setCarousel} />
      <div className="text-[11px]">{description}</div>
      {!addCourse ? (
        <>
          <SearchBar updateQuery={updateQuery} />
          <DraggableCourseContainer results={courseResults} />
          <div className="flex flex-row text-[10px] text-[#3E61ED] gap-x-4">
            <button onClick={() => setAddCourse(true)}>+ ADD COURSE</button>
            <button>+ ADD PLACEHOLDER</button>
          </div>
        </>
      ) : (
        <>
          <div>
            {/* This div is needed for React to recreate component */}
            <SearchBar updateQuery={updateQuery2} />
          </div>
          <SelectableCourseContainer
            results={courseResults2}
            selectedCourses={selectedCourses}
            updateSelectedCourses={updateSelectedCourses}
          />
          <div className="flex flex-row justify-between text-[10px] text-[#3E61ED] gap-x-4">
            <button onClick={handleCancel}>CANCEL</button>
            <button onClick={handleSubmit}>SELECT</button>
          </div>
        </>
      )}
    </>
  );
}
