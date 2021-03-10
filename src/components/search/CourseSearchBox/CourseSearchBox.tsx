import React from 'react';
import { useCourseSearch } from './courseSearch';
import CourseSearchBar from './CourseSearchBar';
import CourseSearchChipList from './CourseSearchChipList';
import SearchResult from './SearchResult';

/**
 * Component properties for a CourseSearchBox.
 */
interface CourseSearchBoxProps {
  onItemSelected: (courseId: string) => void;
}

/**
 * An integrated box that surfaces search results based on a query.
 */
export default function CourseSearchBox({ onItemSelected }: CourseSearchBoxProps): JSX.Element {
  const { results, updateQuery } = useCourseSearch();

  const handleSearchSelection = (resultId: string) => {
    onItemSelected(resultId);
  };

  const resultsList = results.map((result) => {
    return (
      <SearchResult
        key={result.course.id}
        course={result.course}
        taughtNow={false}
        selected={false}
        onAction={handleSearchSelection}
      />
    );
  });

  const preloadChips = [
    {
      id: '0',
      contents: 'CS',
    },
  ];

  return (
    <div className="m-2">
      <CourseSearchBar />
      <CourseSearchChipList chips={preloadChips} />
      <div className="my-2">{resultsList}</div>
    </div>
  );
}
