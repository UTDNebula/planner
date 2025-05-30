import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import React, { ComponentPropsWithoutRef, FC } from 'react';

interface AutoCompleteMajorProps extends ComponentPropsWithoutRef<'div'> {
  onValueChange?: (value: string) => void;
  onInputChange: (query: string) => void;
  options: string[];
  placeholder?: string;
}

const AutoCompleteMajor: FC<AutoCompleteMajorProps & ComponentPropsWithoutRef<'button'>> = ({
  onValueChange,
  onInputChange,
  options,
  placeholder = 'Major',
  ...props
}) => {
  return (
    <div {...props}>
      <div className="absolute -bottom-3 left-0 h-full w-full "></div>
      <Autocomplete
        freeSolo
        disableClearable
        onChange={(_, value) => typeof onValueChange !== 'undefined' && onValueChange(value ?? '')}
        onInputChange={(_, query) => {
          onInputChange(query);
        }}
        options={options}
        sx={{ border: '1px solid var(--color-neutral-500)', borderRadius: '0.375rem' }}
        fullWidth
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              variant="standard"
              className="h-11 appearance-none pl-4 text-[14px] font-semibold text-black outline-none"
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
