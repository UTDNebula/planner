import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navigation, { NavigationStateProps } from '../../components/onboarding/Navigation';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import TransferCreditCard from '../../components/onboarding/TransferCreditCard';

// Array of values to choose from for form
const courses = ['RHET 1302', 'ECS 1100', 'CS 3345', ''];
const subjects = ['ECS', 'EPPS', 'MATH', ''];
const types = ['Transfer', 'AP', 'IB', 'CLEP', 'UTD'];

// AP
const apTests = ['Biology', 'Chemistry', 'Computer Science A'];
const apScores = ['1', '2', '3', '4', '5'];

// IB
const ibTests = ['Biology', 'Chemistry', 'Computer Science A'];
const ibLevels = ['Standard', 'Higher'];
const ibScores = ['1', '2', '3', '4', '5'];

// CLEP
const clepTests = ['Biology', 'Chemistry', 'Computer Science A'];
const clepScores = ['1', '2', '3', '4', '5'];

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
/**
 * Renders a list of MenuItem options for the user to select in the dropdowns.
 *
 * @param array An array of any type where the indices are rendered as separate options
 * @return The rendered list of MenuItems
 */
function returnMenuItems<MenuItem>(menuOptions: string[]) {
  // TODO: Place in utils file
  return menuOptions.map((option) => (
    <MenuItem key={option} value={option}>
      {option}
    </MenuItem>
  ));
}

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

/**
 * TODO: Create method to relay this data to Firebase
 */
function sendData(data: CreditState) {
  console.log('Page 3 data:', data);
}
const data = 0;

export default function PageFour(): JSX.Element {
  const validate = true;

  const [creditState, setCreditState] = useState<CreditState[]>([]);

  const [creditFields, setCreditFields] = useState<CreditState>({ ...clearCreditFields });

  // Handles all form data except DegreePicker
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCreditFields({ ...creditFields, [event.target.name]: event.target.value });
  };

  const handleAutocompleteChange = (event: any, value: string) => {
    // TODO: fix bug that prevents user from clearing Autocomplete

    // TODO: find better way to get/set id of Autocomplete component
    // Gets Autocomplete ID
    let temp: string = event.target.id;
    for (let i = 0; i < temp.length; i++) {
      if (temp[i] === '-') {
        temp = temp.substring(0, i);
        break;
      }
    }
    setCreditFields({ ...creditFields, [temp]: value });
  };

  // For Autocomplete to update when user searches for values(use createFields to get user data)
  const [inputSubjectValue, setInputSubjectValue] = React.useState('');
  const [inputCourseValue, setInputCourseValue] = React.useState('');

  useEffect(() => console.log(creditState));

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
      setCreditState([...creditState, creditFields]);
      // clear setCreditFields
      setCreditFields({ ...clearCreditFields, id: creditFields.id + 1 });
    } else {
      alert('One or more fields missing for credit');
    }
  };

  const removeCard = (removeID) => {
    setCreditState(creditState.filter((element) => element.id !== removeID));
  };
  const router = useRouter();
  const navState: NavigationStateProps = { personal: false, honors: false, credits: true };
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-400">
      <div className="py-16 px-32 rounded shadow-2xl w-2/3 bg-white animate-intro">
        <Navigation
          navigationProps={navState}
          sendData={sendData}
          data={data}
          validate={validate}
        />
        <h2 className="text-4xl text-left font-bold mb-10 text-gray-800">Any Transfer Credits?</h2>
        <div className="column-flex">
          <div className="flex items-center justify-center">
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
                      onChange={handleAutocompleteChange}
                      inputValue={inputSubjectValue}
                      onInputChange={(event, newInputValue) => {
                        setInputSubjectValue(newInputValue);
                      }}
                      id="subject"
                      options={subjects}
                      style={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField {...params} label="Subject" variant="outlined" />
                      )}
                    />
                  </FormControl>
                  <FormControl>
                    <Autocomplete
                      size={'small'}
                      value={creditFields.course}
                      defaultValue={''}
                      onChange={handleAutocompleteChange}
                      inputValue={inputCourseValue}
                      onInputChange={(event, newInputValue) => {
                        setInputCourseValue(newInputValue);
                      }}
                      id="course"
                      options={courses}
                      style={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField {...params} label="Course" variant="outlined" />
                      )}
                    />
                  </FormControl>
                  <FormControl>
                    <InputLabel id="demo-simple-select-autowidth-label">Type</InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      value={creditFields.type}
                      onChange={handleChange}
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
                          onChange={handleChange}
                          fullWidth={true}
                          name="apTest"
                        >
                          {returnMenuItems(apTests)}
                        </Select>
                      </FormControl>
                      <FormControl>
                        <InputLabel id="demo-simple-select-autowidth-label">
                          AP Test Score
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-autowidth-label"
                          id="demo-simple-select-autowidth"
                          value={creditFields.apScore}
                          onChange={handleChange}
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
                          onChange={handleChange}
                          fullWidth={true}
                          name="clepTest"
                        >
                          {returnMenuItems(clepTests)}
                        </Select>
                      </FormControl>
                      <FormControl>
                        <InputLabel id="demo-simple-select-autowidth-label">
                          CLEP Test Score
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-autowidth-label"
                          id="demo-simple-select-autowidth"
                          value={creditFields.clepScore}
                          onChange={handleChange}
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
                          onChange={handleChange}
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
                          onChange={handleChange}
                          fullWidth={true}
                          name="ibLevel"
                        >
                          {returnMenuItems(ibLevels)}
                        </Select>
                      </FormControl>
                      <FormControl>
                        <InputLabel id="demo-simple-select-autowidth-label">
                          IB Test Score
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-autowidth-label"
                          id="demo-simple-select-autowidth"
                          value={creditFields.ibScore}
                          onChange={handleChange}
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
          </div>
        </div>
        <div className="mt-10 flex items-center justify-center">
          <button
            className="mr-10 text-blue-500 hover:text-yellow-500 font-bold rounded"
            onClick={() => router.push('/Onboarding_Pages/pg_2')}
          >
            BACK
          </button>
          <button
            className="text-blue-500 hover:text-yellow-500 font-bold rounded disabled:opacity-50"
            disabled={false} // TODO: Disable button till all options are selected
            onClick={() => router.push('/app')}
          >
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
}
