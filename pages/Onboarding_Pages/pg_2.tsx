import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Navigation, { NavigationStateProps } from '../../components/onboarding/Navigation';
import Checkbox from '@material-ui/core/Checkbox';
import FormLabel from '@material-ui/core/FormLabel';
import { FormGroup, FormControlLabel, Button } from '@material-ui/core';
import DummyData from '../../data/dummy_onboarding.json';

// Array of values to choose from for form
const scholarships = DummyData.scholarships;

const fastTrackYears = DummyData.fastTrackYears;
const majors = DummyData.majors;

export type HonorsType = {
  eugene: boolean;
  terry: boolean;
  national: boolean;
  diversity: boolean;
  aes: boolean;
};

export type PageTwoTypes = {
  scholarship: boolean;
  scholarshipType: string;
  finaid: boolean;
  fastTrack: boolean;
  fastTrackMajor: string;
  fastTrackYear: string;
  honors: HonorsType;
};

/**
 * TODO: Create method to relay this data to Firebase
 */
function sendData(data: PageTwoTypes) {
  console.log('Page 2 data:', data);
}

/**
 * Renders a list of MenuItem options for the user to select in the dropdowns.
 *
 * @param array An array of any type where the indices are rendered as separate options
 * @return The rendered list of MenuItems
 */
function returnMenuItems<MenuItem>(menuOptions: string[]) {
  // TODO: Place in a utils file
  return menuOptions.map((option) => (
    <MenuItem key={option} value={option}>
      {option}
    </MenuItem>
  ));
}

export default function PageTwo(): JSX.Element {
  const router = useRouter();
  const navState: NavigationStateProps = { personal: false, honors: true, credits: false };

  const [scholarshipHonors, setScholarshipHonors] = useState<PageTwoTypes>({
    scholarship: null,
    scholarshipType: '',
    finaid: null,
    fastTrack: null,
    fastTrackMajor: '',
    fastTrackYear: '',
    honors: { eugene: false, terry: false, national: false, diversity: false, aes: false },
  });

  const [validate, setValidate] = useState(false);

  const checkValidate = () => {
    const isPrimaryValid =
      scholarship !== null && finaid !== null && fastTrack !== null ? true : false;
    const scholarshipTypeValid = (scholarship && scholarshipType) || !scholarship;
    const fastTrackValid = (fastTrack && fastTrackMajor && fastTrackYear) || !fastTrack;
    const isValid = isPrimaryValid && scholarshipTypeValid && fastTrackValid ? true : false;
    setValidate(isValid);
  };

  // Handles change for Select
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScholarshipHonors({ ...scholarshipHonors, [event.target.name]: event.target.value });
  };

  // Handles change for Button
  const handleButtonChange = (event, buttonName: string, value: boolean) => {
    setScholarshipHonors({ ...scholarshipHonors, [buttonName]: value });
  };

  // Handles change for Autocomplete
  const handleAutocompleteChange = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setScholarshipHonors({
      ...scholarshipHonors,
      fastTrackMajor: value,
    });
  };

  // Handles change for Checkboxes
  const handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScholarshipHonors({
      ...scholarshipHonors,
      honors: { ...honors, [event.target.name]: event.target.checked },
    });
  };

  React.useEffect(() => {
    checkValidate();
  });
  const { scholarship, scholarshipType, finaid, fastTrack, fastTrackMajor, fastTrackYear, honors } =
    scholarshipHonors;

  const { eugene, terry, national, diversity, aes } = honors;

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-400">
      <div className="py-16 px-32 rounded shadow-2xl w-2/3 bg-white animate-intro">
        <Navigation
          navigationProps={navState}
          sendData={sendData}
          data={scholarshipHonors}
          validate={validate}
        />
        <h2 className="text-4xl text-left font-bold mb-10 text-gray-800">Honors & Scholarships</h2>
        <div className="grid grid-cols-2">
          <h3 className="text-xl mb-10 text-gray-800 mr-10">
            Are you recieving any school provided scholarships?
          </h3>
          <div className="flex items-center mb-10 justify-center">
            <button
              onClick={(event) => handleButtonChange(event, 'scholarship', true)}
              className={`${
                scholarship ? 'bg-yellow-400' : null
              }  mr-5  hover:bg-yellow-400 text-grey-700 font-medium hover:text-white py-1.5 px-16 border border-blue-600 hover:border-transparent rounded`}
            >
              YES
            </button>

            <button
              onClick={(event) => handleButtonChange(event, 'scholarship', false)}
              className={`${
                scholarship == false ? 'bg-yellow-400' : null
              }  ml-5 hover:bg-yellow-400 text-grey-700 font-medium hover:text-white py-1.5 px-16 border border-blue-600 hover:border-transparent rounded`}
            >
              NO
            </button>
          </div>
          {scholarship && (
            <h3 className="text-xl mr-10 mb-10 text-gray-800">
              What type of scholarship did you receive?
            </h3>
          )}
          {scholarship && (
            <FormControl>
              <InputLabel id="demo-simple-select-autowidth-label">Scholarship Type</InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={scholarshipType}
                onChange={handleChange}
                name="scholarshipType"
                label="Type of Scholarship"
              >
                {returnMenuItems(scholarships)}
              </Select>
            </FormControl>
          )}
          <h3 className="text-xl mr-10 mb-10 text-gray-800">Are you recieving financial aid?</h3>
          <div className="flex items-center mb-10 justify-center">
            <button
              onClick={(event) => handleButtonChange(event, 'finaid', true)}
              className={`${
                finaid ? 'bg-yellow-400' : null
              }  mr-5  hover:bg-yellow-400 text-grey-700 font-medium hover:text-white py-1.5 px-16 border border-blue-600 hover:border-transparent rounded`}
            >
              YES
            </button>
            <button
              onClick={(event) => handleButtonChange(event, 'finaid', false)}
              className={`${
                finaid == false ? 'bg-yellow-400' : null
              }  ml-5 hover:bg-yellow-400 text-grey-700 font-medium hover:text-white py-1.5 px-16 border border-blue-600 hover:border-transparent rounded`}
            >
              NO
            </button>
          </div>
          <h3 className="text-xl mr-10 mb-10 text-gray-800">
            Are you in / plan on enrolling in the fast track program?
          </h3>
          <div className="flex items-center mb-10 justify-center">
            <button
              onClick={(event) => handleButtonChange(event, 'fastTrack', true)}
              className={`${
                fastTrack ? 'bg-yellow-400' : null
              }  mr-5 hover:bg-yellow-400 text-grey-700 font-medium hover:text-white py-1.5 px-16 border border-blue-600 hover:border-transparent rounded`}
            >
              YES
            </button>

            <button
              onClick={(event) => handleButtonChange(event, 'fastTrack', false)}
              className={`${
                fastTrack == false ? 'bg-yellow-400' : null
              }  ml-5 hover:bg-yellow-400 text-grey-700 font-medium hover:text-white py-1.5 px-16 border border-blue-600 hover:border-transparent rounded`}
            >
              NO
            </button>
          </div>
          {fastTrack && <h3 className="mr-20 text-lg text-gray-700 ">What major?</h3>}
          {fastTrack && (
            <div className="mb-10">
              <Autocomplete
                value={fastTrackMajor}
                className=""
                onChange={handleAutocompleteChange}
                id="combo-box-demo"
                options={majors}
                style={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Major Name" variant="outlined" />
                )}
              />
            </div>
          )}
          {fastTrack && <h3 className="mr-20 text-lg text-gray-700 ">What year?</h3>}
          {fastTrack && (
            <div className="mb-10">
              <FormControl className="w-32">
                <InputLabel id="demo-simple-select-autowidth-label">Select Year</InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={fastTrackYear}
                  onChange={handleChange}
                  name="fastTrackYear"
                  fullWidth={true}
                >
                  {returnMenuItems(fastTrackYears)}
                </Select>
              </FormControl>
            </div>
          )}

          <h3 className="text-xl mb-10 text-gray-800">Are you in any honors programs?</h3>

          <FormControl component="fieldset">
            <FormLabel component="legend">Select all that apply</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={eugene} onChange={handleCheckChange} name="eugene" />}
                label="The Eugene McDermott Scholars Program"
              />
              <FormControlLabel
                control={<Checkbox checked={terry} onChange={handleCheckChange} name="terry" />}
                label="The Terry Foundation Future Scholars"
              />
              <FormControlLabel
                control={
                  <Checkbox checked={national} onChange={handleCheckChange} name="national" />
                }
                label="National Merit Scholarship Program"
              />
              <FormControlLabel
                control={
                  <Checkbox checked={diversity} onChange={handleCheckChange} name="diversity" />
                }
                label="Diversity Scholars Program"
              />
              <FormControlLabel
                control={<Checkbox checked={aes} onChange={handleCheckChange} name="aes" />}
                label="Academic Excellence Scholarship"
              />
            </FormGroup>
          </FormControl>
        </div>

        <div className="mt-10 flex items-center justify-center">
          <button
            className="mr-10 text-blue-500 hover:text-yellow-500 font-bold rounded"
            onClick={() => router.push('/Onboarding_Pages/pg_1')}
          >
            BACK
          </button>
          <button
            className="text-blue-500 hover:text-yellow-500 font-bold rounded disabled:opacity-50"
            disabled={!validate}
            onClick={() => {
              sendData(scholarshipHonors);
              router.push('/Onboarding_Pages/pg_3');
            }}
          >
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
}
