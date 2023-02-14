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
    <div className="flex min-h-[30px] flex-row items-center justify-between rounded-md border border-[#1C2A6D] pl-5 pr-2">
      <input
        className="text-xs outline-none"
        placeholder="Filter requirements"
        value={query}
        onChange={handleQueryUpdate}
      />

      <SearchIcon />
    </div>
  );
}
