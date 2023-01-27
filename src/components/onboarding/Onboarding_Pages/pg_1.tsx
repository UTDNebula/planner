import DropdownSelect from '@/components/credits/DropdownSelect';
import { displaySemesterCode } from '@/components/planner/Tiles/SemesterTile';
import { generateSemesters } from '@/modules/common/data';
import { TextField } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Semester, SemesterCode, SemesterType } from '@prisma/client';
import React, { useMemo } from 'react';

// TODO: Populate w/ real values
// Array of values to choose from for form

const startSemesters = generateSemesters(12, new Date().getFullYear() - 6, SemesterType.f, false)
  .reverse()
  .map((sem) => sem.code);

const endSemesters = generateSemesters(12, new Date().getFullYear(), SemesterType.f, false)
  .reverse()
  .map((sem) => sem.code);

export type PageOneTypes = {
  name: string;
  startSemester: SemesterCode;
  endSemester: SemesterCode;
  credits: string[];
};

export type Page1Data = {
  handleChange: React.Dispatch<React.SetStateAction<PageOneTypes>>;
  data: PageOneTypes;
  handleValidate: (value: boolean) => void;
};

export default function PageOne({ handleChange, data, handleValidate }: Page1Data): JSX.Element {
  const { name, startSemester, endSemester }: PageOneTypes = data;

  // Handles all form data except DegreePicker
  const setName = (event: SelectChangeEvent<string>) => {
    handleChange({ ...data, [event.target.name]: event.target.value });
  };

  const setStartSemester = (sem: SemesterCode) => {
    handleChange({ ...data, startSemester: sem });
  };

  const setEndSemester = (sem: SemesterCode) => {
    handleChange({ ...data, endSemester: sem });
  };

  const checkValidate = () => {
    const isValid = name && startSemester && endSemester ? true : false;
    handleValidate(isValid);
  };

  React.useEffect(() => {
    checkValidate();
  }, [data]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="animate-intro w-full">
      <h2 className="text-4xl text-left font-bold mb-10 text-gray-800">
        <div>Personal </div>
        <div> Information</div>
      </h2>
      <div className="lg:grid lg:grid-cols-2 mb-12 lg:mb-0 gap-x-32">
        <div>
          <div className="mb-10 flex flex-col">
            {/* <h3 className="text-xl  text-gray-800">Name</h3> */}

            <TextField
              name="name"
              id="outlined-basic"
              className="w-72"
              label="Name"
              variant="outlined"
              value={name}
              onChange={
                setName as
                  | React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
                  | undefined
              }
            />
          </div>

          <div className="mb-10">
            {/* <h3 className="text-xl mb-2 text-gray-800">Student Classification</h3> */}

            <FormControl variant="outlined" className="w-72">
              <InputLabel id="demo-simple-select-autowidth-label">Start Date</InputLabel>

              <DropdownSelect
                id="semester"
                value={startSemester}
                values={startSemesters}
                getValue={(semester) => semester}
                getDisplayedValue={(semester) => displaySemesterCode(semester)}
                onChange={(sem) => {
                  setStartSemester(sem);
                }}
              />
            </FormControl>
          </div>
          <div className="mb-10">
            <FormControl variant="outlined" className="w-72">
              <InputLabel id="demo-simple-select-autowidth-label">Graduation Date</InputLabel>
              <DropdownSelect
                id="semester"
                value={endSemester}
                values={endSemesters}
                getValue={(semester) => semester}
                getDisplayedValue={(semester) => displaySemesterCode(semester)}
                onChange={(sem) => setEndSemester(sem)}
              />
            </FormControl>
          </div>
        </div>
      </div>
    </div>
  );
}
