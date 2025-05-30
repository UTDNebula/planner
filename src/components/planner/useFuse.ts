import Fuse from 'fuse.js';
import { useState, useMemo } from 'react';

interface IUseSearchProps<T> {
  dataSet: T[];
  keys: string[];
  threshold?: number;
}

export default function useFuse<T>({ dataSet, keys, threshold = 0.4 }: IUseSearchProps<T>) {
  const [results, setResults] = useState<T[]>([]);

  const fuse = useMemo(() => {
    const options: Fuse.IFuseOptions<T> = {
      includeScore: true,
      threshold,
      keys,
    };

    return new Fuse(dataSet, options);
  }, [dataSet, keys, threshold]);

  const updateQuery = (query: string) => {
    setResults(fuse.search(query, { limit: 100 }).map((fuseResult) => fuseResult.item));
  };

  /* const results = useMemo(() => {
    if (!query) return dataSet;

    const searchResults = fuse.search(query);

    return searchResults.map((fuseResult) => fuseResult.item);
  }, [fuse, query, dataSet]); */

  return {
    updateQuery,
    results,
  };
}
