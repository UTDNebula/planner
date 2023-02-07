import { ObjectID } from 'bson';

import useSearch, { SearchReturn } from '@/components/search/search';

import { Course, DraggableCourse } from '../types';
import RequirementSearchBar from './RequirementSearchBar';
import SelectableCourseContainer from './SelectableCourseContainer';
import { trpc } from '@/utils/trpc';


export default function AddCourseContainer({
  allCourses,
  validCourses,
  selectedCourses,
  updateSelectedCourses,
  handleCourseCancel,
  handleCourseSubmit,
}: {
  allCourses: string[];
  validCourses: string[];
  selectedCourses: { [key: string]: Course };
  updateSelectedCourses: (course: Course, add: boolean) => void;
  handleCourseCancel: () => void;
  handleCourseSubmit: () => void;
}) {
  const q = trpc.courses.publicGetAllCourses.useQuery(undefined, {
    refetchOnWindowFocus: false
  })
  // TODO: Clean this logic up hella xD
  const { results, updateQuery }: SearchReturn<Course, string> = useSearch({
    getData: async () => q.data ? q.data.map((c)=>({code: c.subject_prefix + c.course_number})) : [],
    initialQuery: '',
    filterFn: (elm, query) => elm.code.toLowerCase().includes(query.toLowerCase()),
    constraints: [0, 5],
  });

  const courseResults = results.map((result) => {
    return {
      ...result,
      status: allCourses.includes(result.code) ? 'complete' : undefined,
      taken: validCourses.includes(result.code),
    };
  }) as unknown as DraggableCourse[];

  const newSelectedCourses: DraggableCourse[] = Object.values(selectedCourses).map((course) => {
    return { id: new ObjectID(), code: course.code };
  });
  return (
    <>
      <div>
        {/* This div is needed for React to recreate component */}
        <RequirementSearchBar updateQuery={updateQuery} />
      </div>
      <SelectableCourseContainer
        results={courseResults}
        selectedCourses={newSelectedCourses.reduce(
          (prev, curr) => ({ ...prev, [curr.code]: curr }),
          {},
        )}
        updateSelectedCourses={updateSelectedCourses}
      />
      <div className="flex flex-row justify-between gap-x-4 text-[10px] text-[#3E61ED]">
        <button onClick={handleCourseCancel}>CANCEL</button>
        <button onClick={handleCourseSubmit}>SELECT</button>
      </div>
    </>
  );
}
