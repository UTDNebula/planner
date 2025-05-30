import { InputBase } from '@mui/material';
import React, { ComponentPropsWithoutRef, useState } from 'react';

import SearchCourseIcon from '@/icons/SearchCourseIcon';

interface SearchBarProps extends ComponentPropsWithoutRef<'div'> {
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

export default SearchBar;
