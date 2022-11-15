import { makeStyles } from '@material-ui/core';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import React, { useRef, useState } from 'react';

const useStyles = makeStyles({
  selectRoot: {
    minWidth: '350px !important',
    borderRadius: '10px',
    border: '2px solid #EDEFF7',
    outline: 'none',
  },
  menuSelected: {
    backgroundColor: '#E4E9FD ',
  },
});

interface DropdownSelectProps<T> {
  id?: string;
  value: string;
  values: T[];
  onChange: (string) => void;
  getValue: (v: T) => string;
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
  const classes = useStyles();

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
        onChange={(e) => onChange(e.target.value)}
        className="rounded-[10px] border-[2px] border-[#EDEFF7] shadow-none px-4 w-full font-medium"
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        sx={{
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
        }}
        MenuProps={{
          classes: { paper: classes.selectRoot },
          anchorEl,
          onClose: () => setAnchorEl(null),
          open: Boolean(anchorEl),
        }}
        IconComponent={() => (
          <div className="min-w-[35px] min-h-[35px] max-w-[35px] max-h-[35px] bg-[#B6C3F8] rounded-full flex justify-center items-center">
            <KeyboardArrowDownIcon className="text-[#3E61ED]" />
          </div>
        )}
      >
        {values.map((v, i) => (
          <MenuItem className="w-full outline-none py-2" value={getValue(v)} key={getValue(v) + i}>
            {getDisplayedValue(v)}
          </MenuItem>
        ))}
      </Select>

      <div ref={anchorRef} className="absolute -bottom-3 left-0 w-full h-full -z-10"></div>
    </div>
  );
};

export default DropdownSelect;
