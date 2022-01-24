import React from 'react';
import { Course } from '../../../modules/common/data';
import CourseCard from '../../common/CourseCard';

/**
 * Component properties for a SearchResult.
 */
interface SearchResultProps {
  /**
   * The data to display for this result.
   */
  course: Course;
  /**
   * True if the result is relevant to the upcoming semester
   */
  taughtNow: boolean;

  /**
   * Whether this result should be in a selected/highlighted state.
   *
   * Useful for multi-select.
   */
  selected: boolean;

  /**
   * A callback triggered when this result is chosen.
   */
  onAction: (resultId: string) => void;
}

/**
 * Information returned from a search query.
 */
export default function SearchResult({ course }: SearchResultProps): JSX.Element {
  return (
    <CourseCard
      id={course.id}
      // onClick={() => {
      //   onAction(course.id);
      // }}
      code={course.catalogCode}
      title={course.title}
      description={course.description}
      creditHours={course.creditHours}
      enabled={false}
    />
  );
}
