import Autocomplete from '@mui/material/Autocomplete';
import Popper from '@mui/material/Popper';
import TextField from '@mui/material/TextField';
import { FC, useCallback, useRef } from 'react';

interface AutoCompleteMajorProps extends React.ComponentPropsWithoutRef<'div'> {
  onValueChange: (value: string) => void;
  onInputChange: (query: string) => void;
  options: string[];
  autoFocus?: boolean;
  placeholder?: string;
  defaultValue?: string;
}

const AutoCompleteMajor: FC<AutoCompleteMajorProps & React.ComponentPropsWithoutRef<'button'>> = ({
  onValueChange,
  onInputChange,
  options,
  autoFocus,
  placeholder = 'Choose your major',
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
          className="z-[9999] overflow-hidden rounded-[10px] text-sm shadow-lg"
          style={{
            width: width,
            border: options.length > 0 ? '1px solid #EDEFF7' : 'none',
          }}
        />
      );
    },
    [containerRef, options.length],
  );

  return (
    <div {...props}>
      <div ref={containerRef} className="absolute -bottom-3 left-0 h-full w-full "></div>
      <Autocomplete
        freeSolo
        disableClearable
        onChange={(_, value) => onValueChange(value ?? '')}
        onInputChange={(_, query) => {
          onInputChange(query);
        }}
        options={options}
        fullWidth
        PopperComponent={CustomPopper}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              variant="standard"
              className="h-11 appearance-none rounded border border-[#6366F1] bg-white pl-4 text-[14px] font-semibold text-black outline-none"
              inputProps={{
                style: { fontSize: 14, marginTop: 8 },
                ...params.inputProps,
              }}
              placeholder={placeholder}
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

export default AutoCompleteMajor;
