import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { useRouter } from 'next/router';
import { DegreeState } from '../DegreePicker';
import DummyData from '../../../data/dummy_onboarding.json';
import DegreePickerGallery, { pickerValidate } from '../DegreePickerGallery';
import React from 'react';

// TODO: Populate w/ real values
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

export type Page1Props = {
  handleChange: React.Dispatch<React.SetStateAction<PageOneTypes>>;
  props: PageOneTypes;
  handleValidate: (value: boolean) => void;
};

export default function PageOne({ handleChange, props, handleValidate }: Page1Props): JSX.Element {
  const router = useRouter();

  const { name, classification, degree, future } = props;

  // Handles all form data except DegreePicker
  const handleStandardChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChange({ ...props, [event.target.name]: event.target.value });
  };

  // Handles DegreePicker
  const handlePickerChange = (updateDegree: DegreeState[]) => {
    handleChange({ ...props, degree: updateDegree });
  };

  const checkValidate = () => {
    const isValid = name && classification && future && pickerValidate(degree) ? true : false;
    handleValidate(isValid);
  };

  React.useEffect(() => {
    checkValidate();
  }, [props]);

  return (
    <div className="animate-intro">
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

        <DegreePickerGallery degree={degree} handleChange={handlePickerChange} />

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
    </div>
  );
}
