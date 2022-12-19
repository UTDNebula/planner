import SearchBar from '@components/credits/SearchBar';
import useSearch from '@/components/search/search';
import { loadDummyCourses } from '@/modules/common/api/courses';
import RequirementsContainer from '@/components/planner/NewCourseSelector/RequirementsContainer';
import SearchResults from './SearchResults';

export default function CourseSelectorContainer({ data }) {
  const { results, updateQuery, getResults, err } = useSearch({
    getData: loadDummyCourses,
    initialQuery: '',
    filterFn: (elm, query) => elm['catalogCode'].toLowerCase().includes(query.toLowerCase()),
    constraints: [0, 5],
  });

  return (
    <div className="flex flex-col gap-y-8 border-2 w-[344px]">
      <SearchBar updateQuery={updateQuery} placeholder="Search courses" />
      <SearchResults results={results} />
      {data.map((req, idx) => (
        <RequirementsContainer key={idx} data={req} />
      ))}
    </div>
  );
}
