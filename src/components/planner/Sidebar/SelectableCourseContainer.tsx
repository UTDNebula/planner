import SelectableCourse from './SelectableCourse';

export default function SelectableCourseContainer({
  results,
  selectedCourses,
  updateSelectedCourses,
}: {
  results: Course[];
  selectedCourses: { [key: string]: Course };
  updateSelectedCourses: (course: Course, add: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-y-4 bg-white text-[#757575]">
      {results.map((elm, idx) => {
        let selected = false;
        if (selectedCourses[elm.code] !== undefined) {
          selected = true;
        }
        return (
          <SelectableCourse
            key={idx}
            course={elm}
            selected={selected}
            selectCourse={updateSelectedCourses}
          />
        );
      })}
    </div>
  );
}
