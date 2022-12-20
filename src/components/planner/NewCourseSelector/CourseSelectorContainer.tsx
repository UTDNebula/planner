import SearchBar from '@components/credits/SearchBar';
import useSearch from '@/components/search/search';
import { loadDummyCourses } from '@/modules/common/api/courses';
import RequirementsContainer from '@/components/planner/NewCourseSelector/RequirementsContainer';
import DraggableCourseContainer from './DraggableCourseContainer';

export interface DegreeRequirementGroup {
  name: string;
  requirements: DegreeRequirement[];
}

export interface DegreeRequirement {
  name: string;
  validCourses: string[];
  courses: string[];
  hours: number;
  isFilled: boolean;
  description?: string;
}

export default function CourseSelectorContainer({ data }: { data: DegreeRequirementGroup[] }) {
  // TODO: Provide UI indicator for errors
  const { results, updateQuery } = useSearch({
    getData: loadDummyCourses,
    initialQuery: '',
    filterFn: (elm, query) => elm['catalogCode'].toLowerCase().includes(query.toLowerCase()),
    constraints: [0, 5],
  });

  return (
    <div className="flex flex-col gap-y-8 border-2 w-[344px]">
      <SearchBar updateQuery={updateQuery} placeholder="Search courses" />
      <div className="bg-white p-4">
        <DraggableCourseContainer results={results} />
      </div>
      {data.map((req, idx) => (
        <RequirementsContainer key={idx} data={req} />
      ))}
    </div>
  );
}
