import { Search as SearchIcon } from '@mui/icons-material';
import { IconButton, InputBase, Paper } from '@mui/material';
import React, { useState } from 'react';

/**
 * A search bar that allows for filtering of queries.
 */

export type SearchBarProps = {
  updateQuery: (query: string) => void;
};

export default function SearchBar({ updateQuery }: SearchBarProps) {
  const [query, setQuery] = useState<string>('');

  const handleQueryUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setQuery(event.target.value);
    updateQuery(event.target.value);
  };

  return (
    <Paper className="sticky top-0 z-20 mx-1 flex flex-row justify-between">
      <InputBase
        className="flex-1 px-4"
        placeholder="Search courses"
        inputProps={{ 'aria-label': 'Search courses' }}
        value={query}
        onChange={handleQueryUpdate}
      />
      <IconButton className="p-2" aria-label="search" size="large">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
