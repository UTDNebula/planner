import useSearch, { SearchReturn } from '@/components/search/search';
import { loadDummyCourses } from '@/modules/common/api/courses';
import { Course } from '@/modules/common/data';
import RequirementSearchBar from './RequirementSearchBar';
import SelectableCourseContainer from './SelectableCourseContainer';

export default function AddCourseContainer({
  allCourses,
  selectedCourses,
  updateSelectedCourses,
  handleCourseCancel,
  handleCourseSubmit,
}: {
  allCourses: Set<string>;
  selectedCourses: { [key: string]: Course };
  updateSelectedCourses: (course: Course, add: boolean) => void;
  handleCourseCancel: () => void;
  handleCourseSubmit: () => void;
}) {
  // TODO: Clean this logic up hella xD
  const { results, updateQuery }: SearchReturn<Course, string> = useSearch({
    getData: loadDummyCourses,
    initialQuery: '',
    filterFn: (elm, query) => elm['catalogCode'].toLowerCase().includes(query.toLowerCase()),
    constraints: [0, 5],
  });

  const courseResults = results.map((result) => {
    return { ...result, status: allCourses.has(result.catalogCode) ? 'Complete' : '' };
  });

  return (
    <>
      <div>
        {/* This div is needed for React to recreate component */}
        <RequirementSearchBar updateQuery={updateQuery} />
      </div>
      <SelectableCourseContainer
        results={courseResults}
        selectedCourses={selectedCourses}
        updateSelectedCourses={updateSelectedCourses}
      />
      <div className="flex flex-row justify-between text-[10px] text-[#3E61ED] gap-x-4">
        <button onClick={handleCourseCancel}>CANCEL</button>
        <button onClick={handleCourseSubmit}>SELECT</button>
      </div>
    </>
  );
}
