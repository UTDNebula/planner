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
      className="bg-white top-0 flex flex-row justify-between z-20 rounded-[10px] overflow-hidden min-h-[55px] border-[2px] border-[#EDEFF7]"
      {...props}
    >
      <InputBase
        className="flex-1 px-4"
        placeholder={placeholder}
        inputProps={{ 'aria-label': 'Search courses' }}
        value={query}
        onChange={handleQueryUpdate}
      />
      <div className="bg-[#3E61ED] min-w-[55px] flex justify-center items-center">
        <IconButton className="p-2 text-white" aria-label="search" size="large">
          <SearchIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default React.memo(SearchBar);
