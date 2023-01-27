import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import React, { useRef, useState } from 'react';

interface DropdownSelectProps<T> {
  id?: string;
  value: T;
  values: T[];
  onChange: (arg: T) => void;
  getValue: (v: T) => T;
  getDisplayedValue: (v: T) => string;
}

const DropdownSelect = <T extends { [key: string]: unknown }>({
  id,
  value,
  values,
  onChange,
  getValue,
  getDisplayedValue,
}: DropdownSelectProps<T>) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={anchorRef}
      className="max-w-[350px] relative"
      onClick={() => setAnchorEl(anchorEl ? null : anchorRef.current)}
    >
      <Select
        id={id}
        value={value}
        label=""
        onChange={(e) => onChange(e.target.value as T)}
        className="rounded-[10px] border-[2px] border-[#EDEFF7] shadow-none px-4 w-full font-medium"
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        sx={{
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
        }}
        MenuProps={{
          anchorEl,
          onClose: () => setAnchorEl(null),
          open: Boolean(anchorEl),
        }}
        IconComponent={() => (
          <button className="min-w-[35px] min-h-[35px] max-w-[35px] max-h-[35px] rounded-full flex justify-center items-center">
            <KeyboardArrowDownIcon className="text-[#3E61ED]" />
          </button>
        )}
      >
        {values.map((v, i) => (
          <MenuItem
            className="w-full outline-none py-2"
            value={getValue(v) as unknown as string}
            key={i as unknown as string}
          >
            {getDisplayedValue(v)}
          </MenuItem>
        ))}
      </Select>

      <div ref={anchorRef} className="absolute -bottom-3 left-0 w-full h-full -z-10"></div>
    </div>
  );
};

export default DropdownSelect;
