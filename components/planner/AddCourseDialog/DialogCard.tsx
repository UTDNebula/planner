import { Course } from "../../../modules/common/data";
import MoreVertIcon from "@mui/icons-material/MoreVert";

/* TODO: Properly style this component */
/**
 * Course Card displayed in AddCourseDialog.tsx
 */
export type DialogCardProps = {
  course: Course;
  setSelectedCourse: (course: Course) => void;
  type: string;
};
export default function DialogCard({
  course,
  setSelectedCourse,
  type,
}: DialogCardProps) {
  const typeMessage: string = type === "Add" ? "Add Course" : "Remove Course";
  return (
    <div className="max-w-lg w-76 h-28 bg-gray-100 shadow-lg border-b p-2">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col items-start">
          <h3 className="font-semibold mr-32 text-md text-gray-700 ">
            {course.catalogCode}
          </h3>
          <p className="text-gray-500 text-xs mt-1 my-1">{course.title}</p>
          <button onClick={() => console.log("Click for more information")}>
            More Info{" "}
          </button>
        </div>
        <div className="flex flex-col items-end">
          <MoreVertIcon onClick={() => console.log("Click for more actions")} />
          <div className="h-full w-full"></div>
          <button onClick={() => setSelectedCourse(course)}>
            {" "}
            {typeMessage}{" "}
          </button>
        </div>
      </div>
    </div>
  );
}
