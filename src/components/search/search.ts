import { useEffect, useState } from 'react';

interface SearchParams<T, K> {
  getData: () => Promise<T[]>;
  initialQuery: K;
  filterFn: (element: T, query: K) => boolean;
  constraints?: [number, number];
}

export interface SearchReturn<T, K> {
  results: T[];
  getResults: () => T[];
  updateQuery: (query: K) => void;
  err: unknown;
}

/**
 * This function performs search & returns relevant data
 */
const useSearch = <T, K>({
  getData,
  initialQuery,
  filterFn,
  constraints = [0, 20],
}: SearchParams<T, K>): SearchReturn<T, K> => {
  const [results, setResults] = useState<T[]>([]);
  const [err, setErr] = useState<unknown>();

  const getResults = () => {
    return results;
  };

  useEffect(() => updateQuery(initialQuery), []);

  // TODO: Insert logc for filtering w/ chips
  // TODO: Update filtering code to deal with data from Nebula API
  const updateQuery = (query: K) => {
    getData()
      .then((data) =>
        data.filter((el) => filterFn(el, query)).slice(constraints[0], constraints[1]),
      )
      .then((data) => setResults(data))
      .catch((error) => {
        setErr(`error was caught in updateQuery: ${error.message}`);
      });
  };

  return { results, getResults, updateQuery, err };
};

export default useSearch;
