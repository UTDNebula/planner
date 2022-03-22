import React from "react";
import { CourseAttempt } from "../../../../modules/auth/auth-context";
/**
 * Component properties for a StudentHistoryView.
 */
interface StudentHistoryViewProps {
  attempts: CourseAttempt[];
}

/**
 * A collection of information for a student's academic career.
 *
 * This functions more like a page than a display component.
 */
export default function StudentHistoryView({
  attempts,
}: StudentHistoryViewProps) {
  return (
    <div className="min-h-screen w-full p-8">
      <div className="max-w-6xl pb-8 mx-auto">
        <h1 className="mb-4 mt-8 text-headline4 font-bold">
          All Course Attempts
        </h1>
        <div>
          {attempts.map((elm, index) => {
            return <div key={elm.course.id}>{elm.course.title}</div>;
          })}
        </div>
      </div>
      <div className="max-w-6xl pb-8 mx-auto">
        <h1 className="mb-4 mt-8 text-headline4 font-bold">
          Academic Career Statistics
        </h1>
      </div>
    </div>
  );
}
