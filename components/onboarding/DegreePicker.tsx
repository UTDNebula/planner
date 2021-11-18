import React, { useState } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import DummyData from '../../data/dummy_onboarding.json';

export interface DegreePickerProps {
  id: number;
  props: DegreeState;
  updateChange: (id: number, degreeState: DegreeState) => void; // Update values of DegreePicker in pg_1.tsx
  removePicker: (id: number) => void; // Remove DegreePicker data from pg_1.tsx
}

export type DegreeState = {
  // id: number;
  degree: string;
  degreeType: string;
  valid: boolean;
};

/**
 * Renders a list of MenuItem options for the user to select in the dropdowns.
 *
 * @param array An array of any type where the indices are rendered as separate options
 * @return The rendered list of MenuItems
 */
function returnMenuItems<MenuItem>(menuOptions: string[]) {
  // TODO: Put in utils file
  return menuOptions.map((option) => (
    <MenuItem key={option} value={option}>
      {option}
    </MenuItem>
  ));
}

export default function DegreePicker({
  id,
  props,
  updateChange,
  removePicker,
}: DegreePickerProps): JSX.Element {
  // TODO: Populate with real degree values
  const degrees = DummyData.degrees;
  const degreeTypes = DummyData.degreeTypes; // No need for other because med school in future

  // Manages if component stays rendered
  const [unmount, setUnmount] = useState(false);

  // Manages data stored in degree picker
  const [degreeState, setDegreeState] = React.useState<DegreeState>(props);

  // Manages input state in Autocomplete
  const [inputValue, setInputValue] = React.useState('');

  const { degree, degreeType } = degreeState;

  const handleAutocompleteChange = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setDegreeState({ ...degreeState, degree: value });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDegreeState({ ...degreeState, [event.target.name]: event.target.value });
  };

  React.useEffect(() => {
    // Send DegreePicker info to pg_1.tsx
    updateChange(id, degreeState);
  }, [degreeState]);

  return (
    <>
      {!unmount && (
        <div className="">
          <div className="mb-4 max-w-lg h-32 w-84 rounded-lg shadow-lg border border-blue-600 p-4 ">
            <div className="grid grid-cols-1 divide-y divide-blue-600 mb-2">
              <div className="flex justify-between">
                <Autocomplete
                  size={'small'}
                  value={degree}
                  defaultValue={''}
                  onChange={handleAutocompleteChange}
                  inputValue={inputValue}
                  onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                  }}
                  id="degree"
                  options={degrees}
                  style={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Degree Name" variant="outlined" />
                  )}
                />

                <button
                  className="flex items-start"
                  onClick={() => {
                    setUnmount(true);
                    removePicker(id);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2 fill-current text-blue-600"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div className="text-xs text-grey-800"> </div>
            </div>
            <FormControl className="w-32 mb-4">
              <InputLabel id="demo-simple-select-autowidth-label">Degree Type</InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                name="degreeType"
                value={degreeType}
                onChange={handleChange}
                id="demo-simple-select-autowidth"
                label="Classification"
              >
                {returnMenuItems(degreeTypes)}
              </Select>
            </FormControl>
          </div>
        </div>
      )}
    </>
  );
}
