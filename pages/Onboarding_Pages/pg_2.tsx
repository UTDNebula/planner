import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import React, { useEffect, useState } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormLabel from '@material-ui/core/FormLabel';
import { FormGroup, FormControlLabel, Button } from '@material-ui/core';
import DummyData from '../../data/dummy_onboarding.json';
import { HonorsIndicator } from '../../modules/common/types';
import { HONORS_INDICATOR_LABELS } from '../../modules/common/data-utils';

// Array of values to choose from for form
const scholarships = DummyData.scholarships;

const fastTrackYears = DummyData.fastTrackYears;
const majors = DummyData.majors;

export type PageTwoTypes = {
  scholarship: boolean;
  scholarshipType: string; // ScholarshipType;
  receivingAid: boolean;
  fastTrack: boolean;
  fastTrackMajor: string;
  fastTrackYear: string;
  honors: HonorsIndicator[];
};

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

export type Page2Props = {
  handleChange: React.Dispatch<React.SetStateAction<PageTwoTypes>>;
  props: PageTwoTypes;
  handleValidate: (value: boolean) => void;
};

export default function PageTwo({ handleChange, props, handleValidate }: Page2Props): JSX.Element {
  const {
    scholarship,
    scholarshipType,
    receivingAid,
    fastTrack,
    fastTrackMajor,
    fastTrackYear,
    honors,
  } = props;

  const honorsCheck = {
    cv: false,
    cs2: false,
    lahc: false,
    bbs: false,
    ah: false,
    epps: false,
    nsm: false,
    atec: false,
  };

  for (const val of honors) {
    const tempKeys = Object.keys(honorsCheck);
    if (tempKeys.includes(val)) {
      honorsCheck[val] = true;
    }
  }

  const checkValidate = () => {
    const isPrimaryValid =
      scholarship !== null && receivingAid !== null && fastTrack !== null ? true : false;
    const scholarshipTypeValid = (scholarship && scholarshipType) || !scholarship;
    const fastTrackValid = (fastTrack && fastTrackMajor && fastTrackYear) || !fastTrack;
    const valid = isPrimaryValid && scholarshipTypeValid && fastTrackValid ? true : false;
    handleValidate(valid);
  };

  // Handles change for Select
  const handleStandardChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChange({ ...props, [event.target.name]: event.target.value });
  };

  // Handles change for Button
  const handleButtonChange = (
    event,
    buttonName: string,
    value: boolean,
    ...clearValues: string[]
  ) => {
    const clear = {};
    for (const val of clearValues) {
      clear[val] = '';
    }

    handleChange({ ...props, [buttonName]: value, ...clear });
  };

  // Handles change for Autocomplete
  const handleAutocompleteChange = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    handleChange({
      ...props,
      fastTrackMajor: value,
    });
  };

  // Handles change for Checkboxes
  const handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    const temp: HonorsIndicator[] = checked
      ? [...honors, event.target.name as HonorsIndicator]
      : honors.filter((value) => value !== event.target.name);
    handleChange({
      ...props,
      honors: temp,
    });
  };

  React.useEffect(() => {
    checkValidate();
  });

  return (
    <div className="animate-intro">
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
            onClick={(event) => {
              handleButtonChange(event, 'scholarship', false, 'scholarshipType');
            }}
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
              onChange={handleStandardChange}
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
            onClick={(event) => handleButtonChange(event, 'receivingAid', true)}
            className={`${
              receivingAid ? 'bg-yellow-400' : null
            }  mr-5  hover:bg-yellow-400 text-grey-700 font-medium hover:text-white py-1.5 px-16 border border-blue-600 hover:border-transparent rounded`}
          >
            YES
          </button>
          <button
            onClick={(event) => handleButtonChange(event, 'receivingAid', false)}
            className={`${
              receivingAid == false ? 'bg-yellow-400' : null
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
            onClick={(event) => {
              handleButtonChange(event, 'fastTrack', false, 'fastTrackMajor', 'fastTrackYear');
            }}
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
                onChange={handleStandardChange}
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
              control={
                <Checkbox checked={honorsCheck['cv']} onChange={handleCheckChange} name="cv" />
              }
              label={HONORS_INDICATOR_LABELS['cv']}
            />
            <FormControlLabel
              control={
                <Checkbox checked={honorsCheck['cs2']} onChange={handleCheckChange} name="cs2" />
              }
              label={HONORS_INDICATOR_LABELS['cs2']}
            />
            <FormControlLabel
              control={
                <Checkbox checked={honorsCheck['lahc']} onChange={handleCheckChange} name="lahc" />
              }
              label={HONORS_INDICATOR_LABELS['lahc']}
            />
            <FormControlLabel
              control={
                <Checkbox checked={honorsCheck['bbs']} onChange={handleCheckChange} name="bbs" />
              }
              label={HONORS_INDICATOR_LABELS['bbs']}
            />
            <FormControlLabel
              control={
                <Checkbox checked={honorsCheck['ah']} onChange={handleCheckChange} name="ah" />
              }
              label={HONORS_INDICATOR_LABELS['ah']}
            />
          </FormGroup>
          <FormControlLabel
            control={
              <Checkbox checked={honorsCheck['epps']} onChange={handleCheckChange} name="epps" />
            }
            label={HONORS_INDICATOR_LABELS['epps']}
          />
          <FormControlLabel
            control={
              <Checkbox checked={honorsCheck['nsm']} onChange={handleCheckChange} name="nsm" />
            }
            label={HONORS_INDICATOR_LABELS['nsm']}
          />
          <FormControlLabel
            control={
              <Checkbox checked={honorsCheck['atec']} onChange={handleCheckChange} name="atec" />
            }
            label={HONORS_INDICATOR_LABELS['atec']}
          />
        </FormControl>
      </div>
    </div>
  );
}
