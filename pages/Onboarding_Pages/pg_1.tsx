import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import DegreePicker, { DegreeState } from '../../components/onboarding/DegreePicker';
import DummyData from '../../data/dummy_onboarding.json';

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

  const { name, classification, degree, future } = props;
  let count = 0;

  // Contains the index of all degree entries & is used to render DegreePicker
  const [degreeCount, setDegreeCount] = useState(
    degree.map((value, index) => {
      return index;
    }),
  );
  const [removeIndex, setRemoveIndex] = useState([]);

  // Handles all form data except DegreePicker
  const handleStandardChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChange({ ...props, [event.target.name]: event.target.value });
  };

  // Handles DegreePicker
  const handleDegreeChange = (formID: number, degreeState: DegreeState) => {
    // Determines if DegreePicker component is valid
    if (!(formID in removeIndex)) {
      degreeState.valid =
        degreeState.degree !== '' && degreeState.degree !== null && degreeState.degreeType !== '';
      let index = 0;
      for (let i = 0; i < removeIndex.length; i++) {
        if (formID < removeIndex[i]) {
          break;
        } else {
          index += 1;
        }
      }
      degree[formID - index] = degreeState;
      handleChange({ ...props, degree: degree });
    }
  };

  const addNewDegree = () => {
    setDegreeCount([...degreeCount, degreeCount[degreeCount.length - 1] + 1]);
    handleChange({
      ...props,
      degree: [
        ...degree,
        {
          degree: '',
          degreeType: '',
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
    // console.log('checkValidate', isValid);
    handleValidate(isValid);
  };

  // TODO: After DegreePicker removed, remove the DegreePicker entry in degree
  const removePicker = (id: number) => {
    console.log(id);
    const temp = degree.filter((value, index) => {
      let test = 0;
      for (let i = 0; i < removeIndex.length; i++) {
        if (id < removeIndex[i]) {
          break;
        } else {
          test += 1;
        }
      }
      return id - test !== index;
    });
    setRemoveIndex([...removeIndex, id]);
    handleChange({ ...props, degree: temp });
  };

  React.useEffect(() => {
    checkValidate();
  }, [props]);

  return (
    <>
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
          {degreeCount.map((elm, index) => {
            if (index in removeIndex) {
              count += 1;

              return (
                <DegreePicker
                  id={index}
                  props={{ degree: '', degreeType: '', valid: false }}
                  updateChange={handleDegreeChange}
                  removePicker={removePicker}
                />
              );
            } else {
              return (
                <DegreePicker
                  id={index}
                  props={degree[index - count]}
                  updateChange={handleDegreeChange}
                  removePicker={removePicker}
                />
              );
            }
          })}
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
