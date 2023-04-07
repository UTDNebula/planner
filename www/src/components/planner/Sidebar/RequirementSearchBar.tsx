import FilterIcon from '@/icons/FilterIcon';
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
    <div className="sticky top-0 z-30 flex min-h-[40px] flex-row items-center rounded-md border border-[#1C2A6D] bg-white px-2 ">
      <FilterIcon className="" />
      <input
        className=" ml-2 text-sm outline-none"
        placeholder="Filter requirements"
        value={query}
        onChange={handleQueryUpdate}
      />
    </div>
  );
}
