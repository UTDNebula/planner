import React from 'react';
import { loadCourses } from '../../../../src/api/courses';
import { Course } from '../../../../src/app/data';

/**
 * Search all courses.
 */
async function performSearch(query: string) {
  console.log('Searching with query: ', query);
  return loadCourses();
}

/**
 * Only searches the courses stored locally.
 */
export function useCourseSearch(): CourseSearchReturnType {
  const [results, setResults] = React.useState<SearchResult[]>([]);

  const updateQuery = ({ query }: SearchRequest) => {
    performSearch(query)
      .then((courses) => {
        const updatedResults = courses.map((course) => ({
          originalQuery: query,
          course: course,
          relevance: 1,
        }));
        setResults(updatedResults);
      })
      .catch((error) => {
        console.error('Could not update query', error);
        // setResults([])
      });
  };

  return {
    results,
    updateQuery,
  };
}

type QueryType = 'all' | 'professor' | 'code';

/**
 * Data used to search and filter by courses.
 */
interface SearchRequest {
  query: string;
  by: QueryType;
}

type SearchResult = {
  originalQuery: string;
  course: Course;
  relevance: number;
};

export type CourseSearchReturnType = {
  results: SearchResult[];
  updateQuery: (request: SearchRequest) => void;
};
