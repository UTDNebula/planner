import { TextField } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { SelectChangeEvent } from '@mui/material/Select';
import { SemesterCode } from '../../../prisma/generated/planner';
import React from 'react';

import DropdownSelect from '@/components/credits/DropdownSelect';
import { displaySemesterCode } from '@/utils/utilFunctions';

// TODO: Populate w/ real values
// Array of values to choose from for form

export type PageOneTypes = {
  name: string;
  startSemester: SemesterCode;
  endSemester: SemesterCode;
};

export type Page1Data = {
  handleChange: (updatedFields: Partial<PageOneTypes>) => void;
  data: PageOneTypes;
  semesterOptions: { startSemesters: SemesterCode[]; endSemesters: SemesterCode[] };
  handleValidate: (value: boolean) => void;
};

export default function PageOne({
  handleChange,
  data,
  handleValidate,
  semesterOptions,
}: Page1Data): JSX.Element {
  const { name, startSemester, endSemester }: PageOneTypes = data;
  const { startSemesters, endSemesters } = semesterOptions;

  // Handles all form data except DegreePicker
  const setName = (event: SelectChangeEvent<string>) => {
    handleChange({ name: event.target.value });
  };

  const setStartSemester = (sem: SemesterCode) => {
    handleChange({ startSemester: sem });
  };

  const setEndSemester = (sem: SemesterCode) => {
    handleChange({ endSemester: sem });
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
