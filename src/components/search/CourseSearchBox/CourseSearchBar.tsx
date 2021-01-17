import React from 'react';
import { IconButton, InputBase, Paper } from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';

/**
 * A search bar that allows for filtering of queries.
 */
export default function CourseSearchBar(): JSX.Element {
  const [query, setQuery] = React.useState('');

  const handleQueryUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    // TODO: Maybe do a timeout or something
    setQuery(value);
  };

  return (
    <Paper className="py-2 px-4" component="form">
      <InputBase
        className="flex-1"
        placeholder="Search catalog for courses"
        inputProps={{ 'aria-label': 'Search courses' }}
        value={query}
        onChange={handleQueryUpdate}
      />
      <IconButton className="p-2" type="submit" aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
