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
}

const SearchBar: FC<SearchBarProps & React.ComponentPropsWithoutRef<'button'>> = ({
  onValueChange,
  onInputChange,
  options,
  autoFocus,
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
          className="rounded-[10px] overflow-hidden shadow-lg z-[9999]"
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
      className="flex items-center gap-5 h-[55px] border-[2px] rounded-[10px] overflow-hidden relative"
      {...props}
    >
      <div ref={containerRef} className="absolute -bottom-3 left-0 w-full h-full"></div>
      <Autocomplete
        style={{ width: '100%' }}
        onChange={(_, value) => onValueChange(value)}
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
                style: {},
                ...params.inputProps,
              }}
              placeholder="Course Code"
              InputProps={{
                ...params.InputProps,
                disableUnderline: true,
              }}
              autoFocus={autoFocus}
            />
          );
        }}
      />
      <div className="bg-[#3E61ED] h-full min-w-[55px] flex justify-center items-center">
        <IconButton className="p-2 text-white" aria-label="search" size="large">
          <SearchIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default SearchBar;
