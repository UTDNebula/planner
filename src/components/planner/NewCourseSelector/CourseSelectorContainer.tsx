import SearchBar from '@components/credits/SearchBar';
import useSearch from '@/components/search/search';
import { loadDummyCourses } from '@/modules/common/api/courses';
import RequirementsContainer from '@/components/planner/NewCourseSelector/RequirementsContainer';
import DraggableCourseContainer from './DraggableCourseContainer';
import { Course } from '@/modules/common/data';

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

export interface DraggableCourseProps extends Course {
  status: string;
}

export default function CourseSelectorContainer({ data }: { data: DegreeRequirementGroup[] }) {
  // TODO: Provide UI indicator for errors
  const { results, updateQuery } = useSearch({
    getData: loadDummyCourses,
    initialQuery: '@',
    filterFn: (elm, query) => elm['catalogCode'].toLowerCase().includes(query.toLowerCase()),
    constraints: [0, 5],
  });

  // TODO: Change later!!! This code hides search bar when no input
  // TODO: Temporary solution to hide search results when no input
  const updateQueryWrapper = (query: string) => {
    if (query === '') {
      query = '@';
    }
    updateQuery(query);
  };

  // Include tag rendering information here (yes for tag & which tag)
  // TODO: Obviously have a better way of computing all courses user has taken
  // Idea is allCourses will be available as context or props or smthn
  const allCourses = new Set();

  // Get all courses user has taken
  data.forEach((reqGroup) => {
    reqGroup.requirements.forEach((req) => {
      req.validCourses.forEach((course) => {
        allCourses.add(course);
      });
    });
  });

  const courseResults = results.map((result) => {
    return { ...result, status: allCourses.has(result.catalogCode) ? 'Complete' : '' };
  });

  return (
    <div className="flex flex-col gap-y-8 border-2 w-[344px]">
      <SearchBar updateQuery={updateQueryWrapper} placeholder="Search courses" />
      {results.length > 0 && (
        <div className="bg-white p-4">
          <DraggableCourseContainer results={courseResults} />
        </div>
      )}
      {data.map((req, idx) => (
        <RequirementsContainer key={idx} data={req} />
      ))}
    </div>
  );
}
