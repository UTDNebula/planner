import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Navigation, { NavigationStateProps } from '../../components/onboarding/Navigation';
import DegreePicker, { DegreeState } from '../../components/onboarding/DegreePicker';

// Array of values to choose from for form
const classificationTypes = ['freshman', 'sophomore', 'junior', 'senior', 'super senior'];
const futureTypes = [
  'law',
  'medical',
  'graduate',
  'industry',
  'entrepreneurship',
  'military',
  'undecided',
];

export type PageOneTypes = {
  name: string;
  classification: string;
  degree: DegreeState[];
  future: string;
};

/**
 * Renders a list of MenuItem options for the user to select in the dropdowns.
 *
 * @param array An array of any type where the indices are rendered as separate options
 * @return The rendered list of MenuItems
 */
function returnMenuItems<MenuItem>(menuOptions: string[]) {
  //TODO: Place in a utils file

  return menuOptions.map((option) => (
    <MenuItem key={option} value={option}>
      {option}
    </MenuItem>
  ));
}

/**
 * TODO: Create method to relay this data to Firebase
 */
function sendData(data) {
  console.log('Page 1 data:', data);
}

// Used to create index to add entries to degree in personal info
let counter = 0;

export default function PageOne(): JSX.Element {
  const router = useRouter();

  const navState: NavigationStateProps = { personal: true, honors: false, credits: false };
  const [personalInfo, setPersonalInfo] = useState<PageOneTypes>({
    name: '',
    classification: '',
    degree: [],
    future: '',
  });

  // Contains the index of all degree entries & is used to render DegreePicker
  const [degreeCount, setDegreeCount] = useState([0]);

  const [validate, setValidate] = useState(true); // Set to false once form validation implemented

  // Handles all form data except DegreePicker
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPersonalInfo({ ...personalInfo, [event.target.name]: event.target.value });
  };

  // Handles DegreePicker
  const handleDegreeChange = (formID: number, degreeState: DegreeState) => {
    let index = 0;
    for (let i = 0; i < degree.length; i++) {
      if (degree[i].id === formID) {
        index = i;
        break;
      }
    }

    degree[index] = degreeState;
    setPersonalInfo({
      ...personalInfo,
      degree: degree,
    });
  };

  // TODO: Implement form validation
  const checkValidate = (): void => {
    console.log('Implement form validation here');
  };

  // TODO: After DegreePicker removed, remove the DegreePicker entry in degree
  const removePicker = (id: number) => {
    setPersonalInfo({ ...personalInfo, degree: degree.filter((value) => value.id !== id) });
  };

  React.useEffect(() => {
    checkValidate();
  }, [personalInfo]);

  const { name, classification, degree, future } = personalInfo;

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-400 ">
      <div className="py-16 px-32 rounded shadow-2xl w-2/3 bg-white animate-intro">
        <Navigation navigationProps={navState} sendData={sendData} data={personalInfo} />
        <h2 className="text-4xl text-left font-bold mb-10 text-gray-800">Tell us about Yourself</h2>
        <div className="grid grid-cols-2">
          <h3 className="text-xl mb-10 text-gray-800">What is your name?</h3>
          <div className="flex items-center justify-center">
            <input
              type="text"
              className="mb-10 border bg-blue-100 py-2 px-4 w-96 outline-none focus:ring-2 focus:ring-blue-600 rounded"
              placeholder="Your name"
              name="name"
              value={name}
              onChange={handleChange}
            />
          </div>

          <h3 className="text-xl mb-10 text-gray-800">Student Classification?</h3>

          <FormControl>
            <InputLabel id="demo-simple-select-autowidth-label">Classification</InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={classification}
              onChange={handleChange}
              fullWidth={true}
              name="classification"
            >
              {returnMenuItems(classificationTypes)}
            </Select>
          </FormControl>

          <h3 className="text-xl mb-10 text-gray-800">What are you studying?</h3>

          <div className="flex flex-col">
            {degreeCount.map((index) => (
              <div key={index}>
                <DegreePicker
                  id={index}
                  updateChange={handleDegreeChange}
                  removePicker={removePicker}
                />
              </div>
            ))}
            <button
              className="mr-10 text-blue-500 hover:text-yellow-500 font-bold rounded"
              onClick={() => {
                counter += 1;
                setDegreeCount([...degreeCount, counter]);
                setPersonalInfo({
                  ...personalInfo,
                  degree: [
                    ...degree,
                    {
                      id: counter,
                      degree: 'Select degree',
                      degreeType: 'Select a type',
                    },
                  ],
                });
              }}
            >
              {' '}
              Add Degree{' '}
            </button>
          </div>

          <h1 className="text-xl ">What do you plan on doing after graduation?</h1>

          <FormControl>
            <InputLabel id="demo-simple-select-autowidth-label">Future Plans</InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={future}
              onChange={handleChange}
              name="future"
            >
              {returnMenuItems(futureTypes)}
            </Select>
          </FormControl>
        </div>

        <div className="mt-10 flex items-center justify-center">
          <button
            className="mr-10 text-blue-500 hover:text-yellow-300 font-bold rounded"
            onClick={() => router.push('/Onboarding_Pages/privacy')}
          >
            BACK
          </button>
          <button
            className="text-blue-500 hover:text-yellow-500 font-bold rounded disabled:opacity-50"
            disabled={!validate} // TODO: Disable button till all options are selected
            onClick={() => {
              sendData(personalInfo);
              router.push('/Onboarding_Pages/pg_2');
            }}
          >
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
}
