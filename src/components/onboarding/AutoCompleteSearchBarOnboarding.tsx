import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Popper from '@mui/material/Popper';
import TextField from '@mui/material/TextField';
import { FC, useCallback, useRef } from 'react';

interface SearchBarProps extends React.ComponentPropsWithoutRef<'div'> {
  onValueChange: (value: string) => void;
  onInputChange: (query: string) => void;
  options: string[];
  autoFocus?: boolean;
  placeholder?: string;
  defaultValue?: string;
}

const SearchBar: FC<SearchBarProps & React.ComponentPropsWithoutRef<'button'>> = ({
  onValueChange,
  onInputChange,
  options,
  autoFocus,
  placeholder = 'Course Code',
  defaultValue = '',
  ...props
}) => {
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
          className="z-[9999] overflow-hidden rounded-[10px] shadow-lg"
          style={{
            width: width,
            border: '1px solid #EDEFF7',
          }}
        />
      );
    },
    [containerRef],
  );

  return (
    <div
      className="relative flex items-center gap-5 overflow-hidden rounded-[10px] border-[2px] h-9"
      {...props}
    >
      <div ref={containerRef} className="absolute -bottom-3 left-0 h-full w-full"></div>
      <Autocomplete
        style={{ width: '100%' }}
        freeSolo
        disableClearable
        onChange={(_, value) => onValueChange(value ?? '')}
        onInputChange={(_, query) => onInputChange(query)}
        options={options}
        fullWidth
        PopperComponent={CustomPopper}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              variant="standard"
              className="px-4"
              inputProps={{
                style: {fontSize: 14},
                ...params.inputProps,
              }}
              placeholder={placeholder}
              InputProps={{
                ...params.InputProps,
                disableUnderline: true,
              }}
              autoFocus={autoFocus}
            />
          );
        }}
      />
      <div className="flex h-full min-w-[55px] items-center justify-center bg-white">
        <IconButton className="p-2 bg-white text-black" aria-label="search" size="large">
          <SearchIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default SearchBar;