import { useRouter } from 'next/router';
import React from 'react';
import BuddyIcon from '@/icons/BuddyIcon';
import PersonIcon from '@/icons/PersonIcon';
import CalendarIcon from '@/icons/CalendarIcon';
import { SemesterCode } from '@prisma/client';
import DropdownSelect from '@/components/credits/DropdownSelect';
import { displaySemesterCode } from '@/utils/utilFunctions';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { useState } from 'react';
import { Menu } from '@mui/icons-material';

export type WelcomeTypes = {
  firstName: string;
  lastName: string;
  startSemester: SemesterCode;
  endSemester: SemesterCode;
};

export type WelcomeData = {
  handleChange: (updatedFields: Partial<WelcomeTypes>) => void;
  data: WelcomeTypes;
  semesterOptions: { startSemesters: SemesterCode[]; endSemesters: SemesterCode[] };
  handleValidate: (value: boolean) => void;
};

export default function Welcome({
  handleChange,
  data,
  handleValidate,
  semesterOptions,
}: WelcomeData): JSX.Element {
  const { firstName, lastName, startSemester, endSemester }: WelcomeTypes = data;

  const setFirstName = (event: SelectChangeEvent<string>) => {
    handleChange({ firstName: event.target.value });
  };

  const setLastName = (event: SelectChangeEvent<string>) => {
    handleChange({ lastName: event.target.value });
  };

  const setStartSemester = (sem: SemesterCode) => {
    handleChange({ startSemester: sem });
  };

  const setEndSemester = (sem: SemesterCode) => {
    handleChange({ endSemester: sem });
  };

  const handleFirstSemesterChange = (event: SelectChangeEvent) => {
    type semesterChars = 'f' | 'u' | 's';
    let firstSemester!: semesterChars;
    switch (event.target.value) {
      case 'f':
        firstSemester = 'f';
        break;
      case 's':
        firstSemester = 's';
        break;
      case 'u':
        firstSemester = 'u';
        break;
    }
    setStartSemester({semester: firstSemester, year: startSemester.year})
  };

  const handleFirstSemesterChangeYear = (event: SelectChangeEvent) => {
    setStartSemester({year: parseInt(event.target.value), semester: startSemester.semester})
  };

  const handleSecondSemesterChange = (event: SelectChangeEvent) => {
    type semesterChars = 'f' | 'u' | 's';
    let secondSemester!: semesterChars;
    switch (event.target.value) {
      case 'f':
        secondSemester = 'f';
        break;
      case 'u':
        secondSemester = 's';
        break;
      case 's':
        secondSemester = 'u';
        break;
    }
    setEndSemester({year: endSemester.year, semester: secondSemester})
  }

  const handleSecondSemesterChangeYear = (event: SelectChangeEvent) => {
    setEndSemester({year: parseInt(event.target.value), semester: endSemester.semester})
  };

  const checkValidate = () => {
    const isValid = firstName && lastName && startSemester && endSemester ? true : false;
    handleValidate(isValid);
  };

  React.useEffect(() => {
    checkValidate();
  }, [data]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="animate-intro">
      <div className='-mb-5'></div>
      <BuddyIcon className='flex items-center justify-center w-full'></BuddyIcon>
      <div className='pt-5'/>
      <h2 className="text-4xl text-gray-800 tracking-tight font-extrabold inline">Welcome to </h2>
      <h2 className="text-4xl font-extrabold text-[#4B4EFC] tracking-tight inline">planner</h2>

      <figcaption className="font-small">
        <div className="mb-1 text-[#737373] text-sm flex items-center justify-center py-2 content-center">Please fill out the forms below</div>
      </figcaption>
      <div className='font-medium text-sm pb-1'>First Name</div>
      <div className="relative"> 
        <input 
          value={firstName}
          onChange={
            setFirstName as
              | React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
              | undefined
          }
          type="text" placeholder="First Name" className="pl-10 input input-bordered text-sm w-full h-9 inline" />
        <PersonIcon className='absolute inline left-4 bottom-2.5'></PersonIcon>
      </div>
      <div className='font-medium pt-5 text-sm pb-1'>Last Name</div>
      <div className='relative'>
        <input 
          value={lastName} 
          onChange={
            setLastName as
              | React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
              | undefined
          } type="text" placeholder="Last Name" className="pl-10 text-sm input input-bordered w-full h-9" />
        <PersonIcon className='absolute inline left-4 bottom-2.5'></PersonIcon>
      </div>
      <h2 className="font-medium text-sm pt-5 pb-1">Start Semester</h2>
      <article className="grid gap-y-0 md:grid-cols-2 md:gap-x-10 lg:gap-x-0">
        <FormControl size='small' sx={{ mt: 0.5, width: 113 }}>
          <Select 
            className='text-sm'
            inputProps={{
              style: {
                fontSize: 14
              }
            }}
            displayEmpty
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={startSemester.semester.toString()}
            onChange={handleFirstSemesterChange}
            autoWidth
          >
            <MenuItem className='text-sm' value="f">Fall</MenuItem>
            <MenuItem className='text-sm' value="u">Summer</MenuItem>
            <MenuItem className='text-sm' value="s">Spring</MenuItem>
          </Select>
        </FormControl>
        <FormControl size='small' sx={{ mt: 0.5, ml:6.5, width: 113 }}>
          <Select
            className='text-sm'
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={startSemester.year.toString()}
            onChange={handleFirstSemesterChangeYear}
            autoWidth
            inputProps={{
              style: {
                fontSize: 14
              }
            }}
            displayEmpty
          >
            <MenuItem className='text-sm' value={"2020"}>2020</MenuItem>
            <MenuItem className='text-sm' value={"2021"}>2021</MenuItem>
            <MenuItem className='text-sm' value={"2022"}>2022</MenuItem>
            <MenuItem className='text-sm' value={"2023"}>2023</MenuItem>
            <MenuItem className='text-sm' value={"2024"}>2024</MenuItem>
            <MenuItem className='text-sm' value={"2025"}>2025</MenuItem>
            <MenuItem className='text-sm' value={"2026"}>2026</MenuItem>
            <MenuItem className='text-sm' value={"2027"}>2027</MenuItem>
            <MenuItem className='text-sm' value={"2028"}>2028</MenuItem>
            <MenuItem className='text-sm' value={"2029"}>2029</MenuItem>
            <MenuItem className='text-sm' value={"2030"}>2030</MenuItem>
          </Select>
        </FormControl>
      </article>
      <h2 className="font-medium text-sm col-span-full pt-5 pb-1">End Semester</h2>
      <article className="grid gap-y-0 md:grid-cols-2">
        <FormControl size='small' sx={{ mt: 0.5, width: 113 }}>
          <Select
            className='text-sm'
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={endSemester.semester.toString()}
            onChange={handleSecondSemesterChange}
            autoWidth
            inputProps={{
              style: {
                fontSize: 14
              }
            }}
            displayEmpty
          >
            <MenuItem className='text-sm' value="f">Fall</MenuItem>
            <MenuItem className='text-sm' value="u">Summer</MenuItem>
            <MenuItem className='text-sm' value="s">Spring</MenuItem>
          </Select>
        </FormControl>
        <FormControl size='small' sx={{ mt: 0.5, ml:6.5, width: 113 }}>
          <Select
            className='text-sm'
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={endSemester.year.toString()}
            onChange={handleSecondSemesterChangeYear}
            autoWidth
            inputProps={{
              style: {
                fontSize: 14
              }
            }}
            displayEmpty
          >
            <MenuItem className='text-sm' value={"2020"}>2020</MenuItem>
            <MenuItem className='text-sm' value={"2021"}>2021</MenuItem>
            <MenuItem className='text-sm' value={"2022"}>2022</MenuItem>
            <MenuItem className='text-sm' value={"2023"}>2023</MenuItem>
            <MenuItem className='text-sm' value={"2024"}>2024</MenuItem>
            <MenuItem className='text-sm' value={"2025"}>2025</MenuItem>
            <MenuItem className='text-sm' value={"2026"}>2026</MenuItem>
            <MenuItem className='text-sm' value={"2027"}>2027</MenuItem>
            <MenuItem className='text-sm' value={"2028"}>2028</MenuItem>
            <MenuItem className='text-sm' value={"2029"}>2029</MenuItem>
            <MenuItem className='text-sm' value={"2030"}>2030</MenuItem>
          </Select>
        </FormControl>  
      </article>
      <div className='pb-5'></div>
    </div>
  );
}
