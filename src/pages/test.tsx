import CourseSelectorContainer, {
  DegreeRequirementGroup,
} from '@/components/planner/NewCourseSelector/CourseSelectorContainer';
import useSearch from '@/components/search/search';
import SearchBar from '@/components/search/SearchBar';
import { loadDummyCourses } from '@/modules/common/api/courses';
import { DndContext } from '@dnd-kit/core';
import React from 'react';
import validationData from '@/data/dummyValidation.json';

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

// Data would be plan data I think?
export default function Test(): JSX.Element {
  const [degreeData, setDegreeData] = React.useState<DegreeRequirementGroup[]>(validationData);

  // Code to test for performance
  const { results, updateQuery } = useSearch({
    getData: loadDummyCourses,
    initialQuery: '@',
    filterFn: (elm, query) => elm['catalogCode'].toLowerCase().includes(query.toLowerCase()),
    constraints: [0, 5],
  });

  const onSubmit = () => {
    const result = results[0];

    // Perform expensive update & setDegreeData
    const newData = [...validationData];
    newData.forEach((degReq) => {
      degReq.requirements.forEach((req) => {
        if (
          req.courses.includes(result.catalogCode) &&
          !req.validCourses.includes(result.catalogCode)
        ) {
          console.log(req.name);
          req.validCourses.push(result.catalogCode);

          // Get total hours
          if (
            getCreditHours(req.validCourses) +
              parseInt(result.catalogCode.split(' ')[1].substring(1, 2)) >
            req.hours
          ) {
            req.isFilled = true;
          }
        }
      });
    });
    console.log(newData);
    setDegreeData(newData);
  };

  return (
    <DndContext>
      <div className="flex flex-row px-10 bg-[#F5F5F5]">
        <CourseSelectorContainer data={degreeData} />
        <div className="flex flex-col">
          <SearchBar updateQuery={updateQuery} />
          {results.map((result, idx) => (
            <div key={idx}>{result.catalogCode}</div>
          ))}
          <button onClick={onSubmit}>Click me </button>
        </div>
      </div>
    </DndContext>
  );
}

// // This gets called on every request
// export async function getServerSideProps() {
//   const validationData = (await import('@/data/dummyValidation.json'))[
//     'default'
//   ] as DegreeRequirementGroup[];

//   // Pass data to the page via props
//   return { props: { data: validationData } };
// }
