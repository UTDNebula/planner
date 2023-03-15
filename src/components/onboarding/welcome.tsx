import React from 'react';
import BuddyIcon from '@/icons/BuddyIcon';
import PersonIcon from '@/icons/PersonIcon';
import { SemesterCode, SemesterType } from '@prisma/client';
import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import EmojiIcons from '@/icons/EmojiIcon';
import AutoCompleteMajor from '@/pages/auth/AutoCompleteMajor';
import majorsList from '@data/majors.json';
import useSearch from '../search/search';
import { SxProps } from '@mui/material/styles';
import { generateSemesters } from '@/utils/utilFunctions';

export type WelcomeTypes = {
  name: string;
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
  const majors = majorsList as string[];
  const { name, startSemester, endSemester }: WelcomeTypes = data;

  const setName = (event: SelectChangeEvent<string>) => {
    handleChange({ name: event.target.value });
  };

  const setStartSemester = (sem: SemesterCode) => {
    handleChange({ startSemester: sem });
  };

  const setEndSemester = (sem: SemesterCode) => {
    handleChange({ endSemester: sem });
  };

  const [major, setMajor] = React.useState("");

  const { results, updateQuery } = useSearch({
    getData: async () =>
      majors ? majors.map((major) => ({ filMajor: `${major}` })) : [],
    initialQuery: '',
    filterFn: (major, query) => major.filMajor.toLowerCase().includes(query.toLowerCase()),
  });


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
        secondSemester = 'u';
        break;
      case 's':
        secondSemester = 's';
        break;
    }
    setEndSemester({ year: endSemester.year, semester: secondSemester });
  };

  const handleSecondSemesterChangeYear = (event: SelectChangeEvent) => {
    setEndSemester({ year: parseInt(event.target.value), semester: endSemester.semester });
  };

  const checkValidate = () => {
    const isValid = name && startSemester && endSemester && Math.floor(endSemester.year) >= Math.floor(startSemester.year) ? true : false;
    handleValidate(isValid);
  };

  React.useEffect(() => {
    checkValidate();
  }, [data]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <div className='flex flex-wrap'>
        {EmojiIcons["sparkle"]}
        <h1 className="-mt-2 text-3xl font-bold leading-normal tracking-tight text-[36px] ml-2">Create An Account</h1>
      </div>
      <p className="text-sm leading-normal text-[16px] text-[#737373] font-semibold">
          Tell us your name, major, and school semesters!
      </p>
      <section className="mt-7 space-y-5">
        <div className="relative mb-4">
          <input
            type="text"
            className="w-[500px] text-[14px] bg-[#F5F5F5] text-[#737373] rounded border p-3 pl-4 outline-none focus:border-[#6366F1]"
            value={name}
            onChange={setName as React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined}
            placeholder="Name"
          ></input>
        </div>
    
        <div className="relative mb-4">
            <AutoCompleteMajor
              className='border outline-none rounded w-[500px]'
              key={0}
              onValueChange={(value) => setMajor(value)}
              onInputChange={(query: string) => updateQuery(query)}
              options={results.map((major: { filMajor: string; }) => major.filMajor)}
              autoFocus>
            </AutoCompleteMajor>
        </div>
        <div className='flex items-center justify-between'>
          <div className='relative mb-4'>
            <Select
              className="w-[225px] h-[50px] text-[14px]  bg-[#F5F5F5] text-[#737373] rounded border pl-1 outline-none"
              sx={{
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#6366F1',
                },
                '.MuiOutlinedInput-notchedOutline': { border: 0 },
              }}
              inputProps={
                {
                  style: {
                    fontSize:"30px"
                  }
                }
              }
              displayEmpty
              id='startingSemInfo'
              value={startSemester.semester.toString()}
              onChange={handleFirstSemesterChange}
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
          </div>
          <div className="relative mb-4">
            <Select
              className="w-[225px] h-[50px] text-[14px]  bg-[#F5F5F5] text-[#737373] rounded border pl-1 outline-none"
              sx={{
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#6366F1',
                },
                '.MuiOutlinedInput-notchedOutline': { border: 0 },
                paddingRight: -10
              }}
              inputProps={
                {
                  style: {
                    fontSize:"30px"
                  }
                }
              }
              displayEmpty
              id='startingSemInfo'
              value={startSemester.year.toString()}
              onChange={handleFirstSemesterChangeYear}
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
          </div>
        </div>
        <div className='flex items-center justify-between'>
        <div className='relative mb-4'>
            <Select
              className="w-[225px] h-[50px] text-[14px]  bg-[#F5F5F5] text-[#737373] rounded border pl-1 outline-none"
              sx={{
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#6366F1',
                },
                '.MuiOutlinedInput-notchedOutline': { border: 0 },
                paddingRight: -10
              }}
              inputProps={
                {
                  style: {
                    fontSize:"30px"
                  }
                }
              }
              displayEmpty
              id='endingSemInfo'
              value={endSemester.semester.toString()}
              onChange={handleSecondSemesterChange}
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
          </div>
          <div className="relative mb-4">
            <Select
              className="w-[225px] h-[50px] text-[14px]  bg-[#F5F5F5] text-[#737373] rounded border pl-1 outline-none"
              sx={{
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#6366F1',
                },
                '.MuiOutlinedInput-notchedOutline': { border: 0 },
                paddingRight: -10
              }}
              inputProps={
                {
                  style: {
                    fontSize:"30px"
                  }
                }
              }
              displayEmpty
              id='startingSemInfo'
              value={endSemester.year.toString()}
              defaultValue='2026'
              onChange={handleSecondSemesterChangeYear}
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
          </div>
        </div>
      </section>
      <div className="pb-5"/>
    </div>
  );
}
