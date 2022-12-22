import { Search as SearchIcon } from '@mui/icons-material';
import React, { useState } from 'react';

/**
 * A search bar that allows for filtering of queries.
 */

export type SearchBarProps = {
  updateQuery: (query: string) => void;
};

export default function SearchBar({ updateQuery }: SearchBarProps): JSX.Element {
  const [query, setQuery] = useState<string>('');

  const handleQueryUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setQuery(event.target.value);
    updateQuery(event.target.value);
  };

  return (
    <div className="rounded-md border-[#1C2A6D] border flex flex-row pl-5 pr-2 h-[30px] justify-between items-center">
      <input
        className="outline-none text-xs"
        placeholder="Filter courses"
        value={query}
        onChange={handleQueryUpdate}
      />

      <SearchIcon />
    </div>
  );
}
