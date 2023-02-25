import React from 'react';
import BuddyIcon from '@/icons/BuddyIcon';
import PersonIcon from '@/icons/PersonIcon';
import { SemesterCode } from '@prisma/client';
import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';

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
    setStartSemester({ semester: firstSemester, year: startSemester.year });
  };

  const handleFirstSemesterChangeYear = (event: SelectChangeEvent) => {
    setStartSemester({ year: parseInt(event.target.value), semester: startSemester.semester });
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
    setEndSemester({ year: endSemester.year, semester: secondSemester });
  };

  const handleSecondSemesterChangeYear = (event: SelectChangeEvent) => {
    setEndSemester({ year: parseInt(event.target.value), semester: endSemester.semester });
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
      <div className="-mb-5"></div>
      <BuddyIcon className="flex w-full items-center justify-center"></BuddyIcon>
      <div className="pt-5" />
      <h2 className="inline text-4xl font-extrabold tracking-tight text-gray-800">Welcome to </h2>
      <h2 className="inline text-4xl font-extrabold tracking-tight text-[#4B4EFC]">planner</h2>

      <figcaption className="font-small">
        <div className="mb-1 flex content-center items-center justify-center py-2 text-sm text-[#737373]">
          Please fill out the forms below
        </div>
      </figcaption>
      <div className="pb-1 text-sm font-medium">First Name</div>
      <div className="relative">
        <input
          value={firstName}
          onChange={
            setFirstName as
              | React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
              | undefined
          }
          type="text"
          placeholder="First Name"
          className="input-bordered input inline h-9 w-full pl-10 text-sm"
        />
        <PersonIcon className="absolute left-4 bottom-2.5 inline"></PersonIcon>
      </div>
      <div className="pt-5 pb-1 text-sm font-medium">Last Name</div>
      <div className="relative">
        <input
          value={lastName}
          onChange={
            setLastName as
              | React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
              | undefined
          }
          type="text"
          placeholder="Last Name"
          className="input-bordered input h-9 w-full pl-10 text-sm"
        />
        <PersonIcon className="absolute left-4 bottom-2.5 inline"></PersonIcon>
      </div>
      <h2 className="pt-5 pb-1 text-sm font-medium">Start Semester</h2>
      <article className="grid gap-y-0 md:grid-cols-2 md:gap-x-10 lg:gap-x-0">
        <FormControl size="small" sx={{ mt: 0.5, width: 113 }}>
          <Select
            className="text-sm"
            inputProps={{
              style: {
                fontSize: 14,
              },
            }}
            displayEmpty
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={startSemester.semester.toString()}
            onChange={handleFirstSemesterChange}
            autoWidth
          >
            <MenuItem className="text-sm" value="f">
              Fall
            </MenuItem>
            <MenuItem className="text-sm" value="u">
              Summer
            </MenuItem>
            <MenuItem className="text-sm" value="s">
              Spring
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ mt: 0.5, ml: 6.5, width: 113 }}>
          <Select
            className="text-sm"
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={startSemester.year.toString()}
            onChange={handleFirstSemesterChangeYear}
            autoWidth
            inputProps={{
              style: {
                fontSize: 14,
              },
            }}
            displayEmpty
          >
            <MenuItem className="text-sm" value={'2020'}>
              2020
            </MenuItem>
            <MenuItem className="text-sm" value={'2021'}>
              2021
            </MenuItem>
            <MenuItem className="text-sm" value={'2022'}>
              2022
            </MenuItem>
            <MenuItem className="text-sm" value={'2023'}>
              2023
            </MenuItem>
            <MenuItem className="text-sm" value={'2024'}>
              2024
            </MenuItem>
            <MenuItem className="text-sm" value={'2025'}>
              2025
            </MenuItem>
            <MenuItem className="text-sm" value={'2026'}>
              2026
            </MenuItem>
            <MenuItem className="text-sm" value={'2027'}>
              2027
            </MenuItem>
            <MenuItem className="text-sm" value={'2028'}>
              2028
            </MenuItem>
            <MenuItem className="text-sm" value={'2029'}>
              2029
            </MenuItem>
            <MenuItem className="text-sm" value={'2030'}>
              2030
            </MenuItem>
          </Select>
        </FormControl>
      </article>
      <h2 className="col-span-full pt-5 pb-1 text-sm font-medium">End Semester</h2>
      <article className="grid gap-y-0 md:grid-cols-2">
        <FormControl size="small" sx={{ mt: 0.5, width: 113 }}>
          <Select
            className="text-sm"
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={endSemester.semester.toString()}
            onChange={handleSecondSemesterChange}
            autoWidth
            inputProps={{
              style: {
                fontSize: 14,
              },
            }}
            displayEmpty
          >
            <MenuItem className="text-sm" value="f">
              Fall
            </MenuItem>
            <MenuItem className="text-sm" value="u">
              Summer
            </MenuItem>
            <MenuItem className="text-sm" value="s">
              Spring
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ mt: 0.5, ml: 6.5, width: 113 }}>
          <Select
            className="text-sm"
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={endSemester.year.toString()}
            onChange={handleSecondSemesterChangeYear}
            autoWidth
            inputProps={{
              style: {
                fontSize: 14,
              },
            }}
            displayEmpty
          >
            <MenuItem className="text-sm" value={'2020'}>
              2020
            </MenuItem>
            <MenuItem className="text-sm" value={'2021'}>
              2021
            </MenuItem>
            <MenuItem className="text-sm" value={'2022'}>
              2022
            </MenuItem>
            <MenuItem className="text-sm" value={'2023'}>
              2023
            </MenuItem>
            <MenuItem className="text-sm" value={'2024'}>
              2024
            </MenuItem>
            <MenuItem className="text-sm" value={'2025'}>
              2025
            </MenuItem>
            <MenuItem className="text-sm" value={'2026'}>
              2026
            </MenuItem>
            <MenuItem className="text-sm" value={'2027'}>
              2027
            </MenuItem>
            <MenuItem className="text-sm" value={'2028'}>
              2028
            </MenuItem>
            <MenuItem className="text-sm" value={'2029'}>
              2029
            </MenuItem>
            <MenuItem className="text-sm" value={'2030'}>
              2030
            </MenuItem>
          </Select>
        </FormControl>
      </article>
      <div className="pb-5"></div>
    </div>
  );
}
