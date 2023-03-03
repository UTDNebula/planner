import SearchCourseIcon from '@/icons/SearchCourseIcon';
import { Search as SearchIcon } from '@mui/icons-material';
import { IconButton, InputBase } from '@mui/material';
import React, { useState } from 'react';

interface SearchBarProps extends React.ComponentPropsWithoutRef<'div'> {
  updateQuery: (query: string) => void;
  placeholder: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, updateQuery, ...props }) => {
  const [query, setQuery] = useState<string>('');

  const handleQueryUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setQuery(event.target.value);
    updateQuery(event.target.value);
  };

  return (
    <div
      className="top-0 z-20 flex min-h-[55px] flex-row justify-between overflow-hidden rounded-[10px] border-[2px] border-[#EDEFF7] bg-white"
      {...props}
    >
      <InputBase
        className="flex-1 px-4"
        placeholder={placeholder}
        inputProps={{ 'aria-label': 'Search courses' }}
        value={query}
        onChange={handleQueryUpdate}
      />
      <div className="flex min-w-[55px] items-center justify-center bg-[#3E61ED]">
        <IconButton className="p-2 text-white" aria-label="search" size="large">
          <SearchIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default React.memo(SearchBar);

export const SearchBarTwo: React.FC<SearchBarProps> = ({ placeholder, updateQuery, ...props }) => {
  const [query, setQuery] = useState<string>('');

  const handleQueryUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setQuery(event.target.value);
    updateQuery(event.target.value);
  };

  return (
    <div
    {...props}
      className={`top-0 z-20 flex h-10 flex-row items-center justify-between overflow-hidden rounded-[10px] border-[2px] border-[#EDEFF7] px-4 ${props.className}`}
    >
      <SearchCourseIcon />
      <InputBase
        className="flex-1 px-4"
        placeholder={placeholder}
        inputProps={{ 'aria-label': 'Search courses' }}
        value={query}
        onChange={handleQueryUpdate}
      />
    </div>
  );
};
