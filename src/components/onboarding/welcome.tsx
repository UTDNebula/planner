import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import Link from 'next/link';
import React from 'react';

import AutoCompleteMajor from '@/components/AutoCompleteMajor';
import EmojiIcons from '@/icons/EmojiIcon';
import useMajors from '@/shared/useMajors';
import { SemesterCode } from 'prisma/utils';

import useSearch from '../search/search';

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

  const [major, setMajor] = React.useState('');
  const { majors, err } = useMajors();

  const { results, updateQuery } = useSearch({
    constraints: [0, 900], // used a random large number, since i dont know exactly how many majors there are
    getData: async () => (majors ? majors.map((major) => ({ filMajor: `${major}` })) : []),
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
    const isValid =
      name &&
      startSemester &&
      endSemester &&
      Math.floor(endSemester.year) >= Math.floor(startSemester.year)
        ? true
        : false;
    handleValidate(isValid);
  };

  React.useEffect(() => {
    checkValidate();
  }, [data]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (err) {
    return (
      <>
        Oops, we ran into an error! Please let us know on our{' '}
        <Link href="https://discord.gg/anrh9B2Z3w" className="underline">
          discord
        </Link>{' '}
        to get it fixed as soon as possible.
      </>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap">
        {EmojiIcons['sparkle']}
        <h1 className="-mt-2 ml-2 text-3xl text-[36px] font-bold leading-normal tracking-tight">
          Create An Account
        </h1>
      </div>
      <p className="text-[16px] text-sm font-semibold leading-normal text-[#737373]">
        Tell us your name, major, and school semesters!
      </p>
      <section className="mt-7">
        <div className="relative mb-4">
          <input
            type="text"
            className="w-[500px] rounded border bg-[#F5F5F5] p-3 pl-4 text-[14px] text-[#737373] outline-none focus:border-[#6366F1]"
            value={name}
            onChange={
              setName as
                | React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
                | undefined
            }
            placeholder="Name"
          ></input>
        </div>

        <div className="relative mb-5">
          <AutoCompleteMajor
            className="w-[500px] rounded border outline-none"
            key={0}
            onValueChange={(value) => setMajor(value)}
            onInputChange={(query: string) => updateQuery(query)}
            options={results.map((major: { filMajor: string }) => major.filMajor)}
            autoFocus
          ></AutoCompleteMajor>
        </div>
        <div className="mb-2 font-medium">Starting Semester:</div>
        <div className="flex items-center justify-between">
          <div className="relative mb-4">
            <Select
              className="h-[50px] w-[225px] rounded  border bg-[#F5F5F5] pl-1 text-[14px] text-[#737373] outline-none"
              sx={{
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#6366F1',
                },
                '.MuiOutlinedInput-notchedOutline': { border: 0 },
              }}
              inputProps={{
                style: {
                  fontSize: '30px',
                },
              }}
              displayEmpty
              id="startingSemInfo"
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
              className="h-[50px] w-[225px] rounded  border bg-[#F5F5F5] pl-1 text-[14px] text-[#737373] outline-none"
              sx={{
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#6366F1',
                },
                '.MuiOutlinedInput-notchedOutline': { border: 0 },
                paddingRight: -10,
              }}
              inputProps={{
                style: {
                  fontSize: '30px',
                },
              }}
              displayEmpty
              id="startingSemInfo"
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
        <div className="mb-2 font-medium">Ending Semester:</div>
        <div className="flex items-center justify-between">
          <div className="relative mb-4">
            <Select
              className="h-[50px] w-[225px] rounded  border bg-[#F5F5F5] pl-1 text-[14px] text-[#737373] outline-none"
              sx={{
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#6366F1',
                },
                '.MuiOutlinedInput-notchedOutline': { border: 0 },
                paddingRight: -10,
              }}
              inputProps={{
                style: {
                  fontSize: '30px',
                },
              }}
              displayEmpty
              id="endingSemInfo"
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
              className="h-[50px] w-[225px] rounded  border bg-[#F5F5F5] pl-1 text-[14px] text-[#737373] outline-none"
              sx={{
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#6366F1',
                },
                '.MuiOutlinedInput-notchedOutline': { border: 0 },
                paddingRight: -10,
              }}
              inputProps={{
                style: {
                  fontSize: '30px',
                },
              }}
              displayEmpty
              id="startingSemInfo"
              value={endSemester.year.toString()}
              defaultValue="2026"
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
      <div className="pb-5" />
    </div>
  );
}
