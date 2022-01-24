import React, { useState } from 'react';
import { IconButton, InputBase, Paper } from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';

/**
 * A search bar that allows for filtering of queries.
 */

export type SearchBarProps = {
  updateQuery: (query: string) => void;
};

export default function SearchBar({ updateQuery }: SearchBarProps): JSX.Element {
  const [query, setQuery] = useState<string>('');

  const handleQueryUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    updateQuery(event.target.value);
  };

  return (
    <Paper className="sticky top-0 w-[19rem] flex flex-row justify-between" component="form">
      <InputBase
        className="flex-1 "
        placeholder="Search courses"
        inputProps={{ 'aria-label': 'Search courses' }}
        value={query}
        onChange={handleQueryUpdate}
      />
      <IconButton className="p-2" aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
