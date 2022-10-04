import SearchIcon from '@mui/icons-material/Search';
import Autocomplete from '@mui/material/Autocomplete';
import Popper from '@mui/material/Popper';
import TextField from '@mui/material/TextField';
import { FC, useCallback, useRef } from 'react';

interface SearchBarProps {
  onChange: (value: string) => void;
  onInputChange: (query: string) => void;
  options: string[];
}

const SearchBar: FC<SearchBarProps> = ({ onChange, onInputChange, options }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const CustomPopper = useCallback(
    (props) => {
      if (!containerRef.current) {
        return <div></div>;
      }
      const { width } = containerRef.current.getBoundingClientRect();
      return (
        <Popper
          {...props}
          placement="bottom"
          anchorEl={containerRef.current}
          className="rounded-lg overflow-hidden shadow-lg"
          style={{
            width: width,
            border: '1px solid grey',
          }}
        />
      );
    },
    [containerRef],
  );

  return (
    <div className="flex items-center gap-5 border-2 border-black rounded-full py-2 px-5 relative">
      <div ref={containerRef} className="absolute -bottom-3 left-0 w-full h-full"></div>
      <SearchIcon className="text-black" />
      <Autocomplete
        style={{ width: '100%' }}
        onChange={(_, value) => onChange(value)}
        onInputChange={(_, query) => onInputChange(query)}
        options={options}
        fullWidth
        PopperComponent={CustomPopper}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              variant="standard"
              inputProps={{
                style: {},
                ...params.inputProps,
              }}
              placeholder="Course Code"
              InputProps={{
                ...params.InputProps,
                disableUnderline: true,
              }}
            />
          );
        }}
      />
    </div>
  );
};

export default SearchBar;
