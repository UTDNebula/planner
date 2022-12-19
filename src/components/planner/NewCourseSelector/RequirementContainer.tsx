import useSearch from '@/components/search/search';
import SearchBar from '@/components/search/SearchBar';
import DraggableCourse from './DraggableCourse';
import DraggableCourseContainer from './DraggableCourseContainer';
import RequirementContainerHeader from './RequirementContainerHeader';

export default function RequirementContainer({
  data,
  requirementIdx,
  accordian,
  carousel,
  setCarousel,
}) {
  // TODO: Change this later
  const getCourses = async () => {
    return data[requirementIdx].courses;
  };

  // TODO: Move to utils file
  const getCreditHours = (data) => {
    return data.length > 0
      ? sumList(
          Object.values(
            data[requirementIdx].validCourses.map((elm, idx) => {
              return parseInt(elm.split(' ')[1].substring(1, 2));
            }),
          ),
        )
      : 0;
  };

  const sumList = (values) => {
    return values.reduce((prev: number, curr: number) => prev + curr);
  };

  const { results, updateQuery, getResults, err } = useSearch({
    getData: getCourses,
    initialQuery: '',
    filterFn: (elm: string, query) => elm.toLowerCase().includes(query.toLowerCase()),
    constraints: [0, 5],
  });

  const numCredits = getCreditHours(data);
  const description =
    'CS guided electives are 4000 level CS courses approved by the students CS advisor. Thefollowing courses may be used as guided electives without the explicit approval of an advisor.';

  return (
    <>
      <RequirementContainerHeader
        data={data}
        numCredits={numCredits}
        requirementIdx={requirementIdx}
        setCarousel={setCarousel}
      />
      <div className="text-[11px]">{description}</div>;
      <SearchBar updateQuery={updateQuery} />
      <DraggableCourseContainer results={results} />
    </>
  );
}
