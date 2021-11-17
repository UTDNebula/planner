import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import React, { SetStateAction, useState } from 'react';
import { useRouter } from 'next/router';
import Navigation, { NavigationStateProps } from '../../components/onboarding/Navigation';
import DegreePicker, { DegreeState } from '../../components/onboarding/DegreePicker';
import DummyData from '../../data/dummy_onboarding.json';
import { CareerGoal } from '../app/onboarding';

// Array of values to choose from for form
const classificationTypes = DummyData.classificationTypes;
const futureTypes = DummyData.futureTypes;

export type PageOneTypes = {
  name: string;
  classification: string;
  degree: DegreeState[];
  future: string; // CareerGoal;
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
function sendData(data: PageOneTypes) {
  console.log('Page 1 data:', data);
}

// Used to create index to add entries to degree in personal info
let counter = 0;

export type Page1Props = {
  handleChange: React.Dispatch<React.SetStateAction<PageOneTypes>>;
  props: PageOneTypes;
  isValid: boolean;
  handleValidate: (value: boolean) => void;
};

export default function PageOne({
  handleChange,
  props,
  isValid,
  handleValidate,
}: Page1Props): JSX.Element {
  const router = useRouter();

  const navState: NavigationStateProps = { personal: true, honors: false, credits: false };

  // Contains the index of all degree entries & is used to render DegreePicker
  const [degreeCount, setDegreeCount] = useState([0]);

  // Controls state of degreePicker
  // const [degree, setDegree] = useState<DegreeState[]>([]);

  // Handles all form data except DegreePicker
  const handleStandardChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChange({ ...props, [event.target.name]: event.target.value });
  };

  // Handles DegreePicker
  const handleDegreeChange = (formID: number, degreeState: DegreeState) => {
    // Determines if DegreePicker component is valid
    degreeState.valid =
      degreeState.degree !== '' && degreeState.degree !== null && degreeState.degreeType !== '';
    let index = 0;
    for (let i = 0; i < degree.length; i++) {
      if (degree[i].id === formID) {
        index = i;
        break;
      }
    }
    degree[index] = degreeState;
    // setDegree(degree);
    // let asdf = degreeToPlan();
    // handleChange('plan', asdf);
    handleChange({ ...props, degree: degree });
  };

  const addNewDegree = () => {
    counter += 1;
    setDegreeCount([...degreeCount, counter]);
    handleChange({
      ...props,
      degree: [
        ...degree,
        {
          id: counter,
          degree: 'Select degree',
          degreeType: 'Select a type',
          valid: false,
        },
      ],
    });
  };

  // Validates DegreePicker component
  const pickerValidate = () => {
    if (degree.length < 1) {
      return false;
    }
    let element: DegreeState;
    for (element of degree) {
      if (!element.valid) {
        return false;
      }
    }
    return true;
  };

  const checkValidate = () => {
    const isValid = name && classification && future && pickerValidate() ? true : false;
    console.log('checkValidate', isValid);
    handleValidate(isValid);
  };

  // TODO: After DegreePicker removed, remove the DegreePicker entry in degree
  const removePicker = (id: number) => {
    handleChange({ ...props, degree: degree.filter((value) => value.id !== id) });
    // let newDegree = degree.filter((value) => value.id !== id);
    // setDegree(newDegree);
    // handleChange('plan', degreeToPlan());
  };

  React.useEffect(() => {
    checkValidate();
  }, [props]);

  const { name, classification, degree, future } = props;
  const validate = isValid;
  // const validate = false;
  // const [ name, classification, future, plan, validate] = props;

  return (
    <>
      <Navigation navigationProps={navState} sendData={sendData} data={props} validate={validate} />
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
            onChange={handleStandardChange}
          />
        </div>

        <h3 className="text-xl mb-10 text-gray-800">Student Classification?</h3>

        <FormControl>
          <InputLabel id="demo-simple-select-autowidth-label">Classification</InputLabel>
          <Select
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={classification}
            onChange={handleStandardChange}
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
            onClick={addNewDegree}
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
            onChange={handleStandardChange}
            name="future"
          >
            {returnMenuItems(futureTypes)}
          </Select>
        </FormControl>
      </div>
    </>
  );
}
