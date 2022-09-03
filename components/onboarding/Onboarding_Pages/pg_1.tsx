import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useRouter } from 'next/router';
import { DegreeState } from '../DegreePicker';
import DummyData from '../../../data/dummy_onboarding.json';
import DegreePickerGallery, { pickerValidate } from '../DegreePickerGallery';
import React from 'react';
import { TextField } from '@mui/material';

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

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="animate-intro w-full">
      <h2 className="text-4xl text-left font-bold mb-10 text-gray-800">
        <div>Personal </div>
        <div> Information</div>
      </h2>
      <div className="grid grid-cols-2 gap-x-32">
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
              onChange={handleStandardChange}
            />
          </div>

          <div className="mb-10">
            {/* <h3 className="text-xl mb-2 text-gray-800">Student Classification</h3> */}

            <FormControl variant="outlined">
              <InputLabel id="demo-simple-select-autowidth-label">Grade</InputLabel>

              <Select
                labelId="demo-simple-select-autowidth-label"
                name="classification"
                value={classification}
                onChange={handleStandardChange}
                id="demo-simple-select-autowidth"
                className="w-72"
                label="grade"
              >
                {returnMenuItems(classificationTypes)}
              </Select>
            </FormControl>
          </div>
          <div className="mb-10">
            {/* <h3 className="text-xl ">Post Graduation Plan</h3> */}

            <FormControl variant="outlined">
              <InputLabel disableAnimation={false} id="demo-simple-select-autowidth-label">
                Future Plans
              </InputLabel>

              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                className="w-72"
                value={future}
                onChange={handleStandardChange}
                name="future"
                label="Future Plans"
              >
                {returnMenuItems(futureTypes)}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="w-72">
          {/* <h3 className="text-xl  text-gray-800">Degree</h3> */}
          <DegreePickerGallery degree={degree} handleChange={handlePickerChange} />
        </div>
      </div>
    </div>
  );
}
