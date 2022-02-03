import { FormControl, TextField, InputLabel, Select, MenuItem } from '@mui/material';
import { Autocomplete } from '@mui/material';
import React, { useEffect } from 'react';
import { useState } from 'react';
import DummyData from '../../data/dummy_onboarding.json';
import TransferCreditCard from './TransferCreditCard';

type TransferCreditGalleryProps = {
  creditState: CreditState[];
  handleChange: (value: CreditState[]) => void;
};

export type CreditState = {
  id: number;
  subject: string;
  course: string;
  type: string;
  transferSubject?: string;
  transferCourse?: string;
  apTest?: string;
  apScore?: string;
  ibTest?: string;
  ibLevel?: string;
  ibScore?: string;
  clepTest?: string;
  clepScore?: string;
};

// Variables that store values used in onboarding form
const courses = DummyData.courses;
const subjects = DummyData.subjects;
const types = DummyData.types;

// AP
const apTests = DummyData.apTests;
const apScores = DummyData.apScores;

// IB
const ibTests = DummyData.ibTests;
const ibLevels = DummyData.ibLevels;
const ibScores = DummyData.ibScores;

// CLEP
const clepTests = DummyData.clepTests;
const clepScores = DummyData.clepScores;

const clearCreditFields = {
  id: 0,
  subject: '',
  course: '',
  type: '',
  apTest: '',
  apScore: '',
  ibTest: '',
  ibLevel: '',
  ibScore: '',
  clepTest: '',
  clepScore: '',
};

function returnMenuItems<MenuItem>(menuOptions: string[]) {
  //TODO: Place in a utils file

  return menuOptions.map((option) => (
    <MenuItem key={option} value={option}>
      {option}
    </MenuItem>
  ));
}
export default function TransferCreditGallery({
  creditState,
  handleChange,
}: TransferCreditGalleryProps) {
  const [creditFields, setCreditFields] = useState<CreditState>({ ...clearCreditFields });

  // Handles all form data except DegreePicker
  const handleStandardChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCreditFields({ ...creditFields, [event.target.name]: event.target.value });
  };

  const handleSubjectChange = (event: any, value: string) => {
    setCreditFields({ ...creditFields, subject: value });
  };

  const handleCourseChange = (event: any, value: string) => {
    setCreditFields({ ...creditFields, course: value });
  };

  // For Autocomplete to update when user searches for values(use createFields to get user data)
  const [inputSubjectValue, setInputSubjectValue] = React.useState('');
  const [inputCourseValue, setInputCourseValue] = React.useState('');

  useEffect(() => console.log(creditState, creditFields));

  // validation variables
  const primary =
    creditFields.subject !== '' && creditFields.course !== '' && creditFields.type !== '';
  const ap = !(
    creditFields.type === 'AP' &&
    (creditFields.apScore === '' || creditFields.apTest === '')
  );
  const ib = !(
    creditFields.type === 'IB' &&
    (creditFields.ibLevel === '' || creditFields.ibScore === '' || creditFields.ibTest === '')
  );
  const clep = !(
    creditFields.type === 'CLEP' &&
    (creditFields.clepScore == '' || creditFields.clepTest === '')
  );

  const addTransferCredit = async () => {
    // Validate Transfer Credit card
    if (primary && ap && ib && clep) {
      // add card to creditState
      handleChange([...creditState, creditFields]);
      // clear setCreditFields
      setCreditFields({ ...clearCreditFields, id: creditFields.id + 1 });
    } else {
      alert('One or more fields missing for credit');
    }
  };

  const removeCard = (removeID) => {
    handleChange(creditState.filter((element) => element.id !== removeID));
  };

  return (
    <div className="w-full rounded-lg shadow-lg p-4 colum-flex md:flex-row flex-col">
      <h2 className="text-xl text-center font-semibold m-5 mb-10 text-gray-800">
        Transfer Credit Conversion Tool
      </h2>
      <div className="grid grid-cols-2 gap-10 items-center mb-10 justify-center ">
        <div className="inline-flex flex-col">
          <FormControl>
            <Autocomplete
              size={'small'}
              value={creditFields.subject}
              defaultValue={''}
              onChange={handleSubjectChange}
              inputValue={inputSubjectValue}
              onInputChange={(event, newInputValue) => {
                setInputSubjectValue(newInputValue);
              }}
              id="subject"
              options={subjects}
              style={{ width: 200 }}
              renderInput={(params) => <TextField {...params} label="Subject" variant="outlined" />}
            />
          </FormControl>
          <FormControl>
            <Autocomplete
              size={'small'}
              value={creditFields.course}
              defaultValue={''}
              onChange={handleCourseChange}
              inputValue={inputCourseValue}
              onInputChange={(event, newInputValue) => {
                setInputCourseValue(newInputValue);
              }}
              id="course"
              options={courses}
              style={{ width: 200 }}
              renderInput={(params) => <TextField {...params} label="Course" variant="outlined" />}
            />
          </FormControl>
          <FormControl>
            <InputLabel id="demo-simple-select-autowidth-label">Type</InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={creditFields.type}
              onChange={handleStandardChange}
              fullWidth={true}
              name="type"
            >
              {returnMenuItems(types)}
            </Select>
          </FormControl>
          {creditFields['type'] === 'AP' && (
            <>
              <FormControl>
                <InputLabel id="demo-simple-select-autowidth-label">AP Tests</InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={creditFields.apTest}
                  onChange={handleStandardChange}
                  fullWidth={true}
                  name="apTest"
                >
                  {returnMenuItems(apTests)}
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel id="demo-simple-select-autowidth-label">AP Test Score</InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={creditFields.apScore}
                  onChange={handleStandardChange}
                  fullWidth={true}
                  name="apScore"
                >
                  {returnMenuItems(apScores)}
                </Select>
              </FormControl>
            </>
          )}

          {creditFields['type'] === 'CLEP' && (
            <>
              <FormControl>
                <InputLabel id="demo-simple-select-autowidth-label">CLEP Tests</InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={creditFields.clepTest}
                  onChange={handleStandardChange}
                  fullWidth={true}
                  name="clepTest"
                >
                  {returnMenuItems(clepTests)}
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel id="demo-simple-select-autowidth-label">CLEP Test Score</InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={creditFields.clepScore}
                  onChange={handleStandardChange}
                  fullWidth={true}
                  name="clepScore"
                >
                  {returnMenuItems(clepScores)}
                </Select>
              </FormControl>
            </>
          )}

          {creditFields['type'] === 'IB' && (
            <>
              <FormControl>
                <InputLabel id="demo-simple-select-autowidth-label">IB Tests</InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={creditFields.ibTest}
                  onChange={handleStandardChange}
                  fullWidth={true}
                  name="ibTest"
                >
                  {returnMenuItems(ibTests)}
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel id="demo-simple-select-autowidth-label">IB Level</InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={creditFields.ibLevel}
                  onChange={handleStandardChange}
                  fullWidth={true}
                  name="ibLevel"
                >
                  {returnMenuItems(ibLevels)}
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel id="demo-simple-select-autowidth-label">IB Test Score</InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={creditFields.ibScore}
                  onChange={handleStandardChange}
                  fullWidth={true}
                  name="ibScore"
                >
                  {returnMenuItems(ibScores)}
                </Select>
              </FormControl>
            </>
          )}
          <button
            className="mr-10 text-blue-500 hover:text-yellow-500 font-bold rounded"
            onClick={() => {
              addTransferCredit();
            }}
          >
            Add Credit
          </button>
        </div>

        <div className="flex flex-col">
          <div className="bg-blue-900 text-white">
            <h2> My Credits </h2>
          </div>
          <div className="overflow-y-scroll h-72">
            {creditState.map((element, index) => (
              <div key={index.toString()}>
                <TransferCreditCard
                  id={element.id}
                  course={element.course}
                  removeCard={() => removeCard(element.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
