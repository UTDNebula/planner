import { FormControlLabel, FormGroup } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import React from 'react';

import DummyData from '../../../data/dummy_onboarding.json';
import Degrees from '../../../data/majors.json';
import { HONORS_INDICATOR_LABELS } from '../../../modules/common/data-utils';
import { HonorsIndicator } from '../../../modules/common/types';

// Array of values to choose from for form
const scholarships = DummyData.scholarships;

const fastTrackYears = DummyData.fastTrackYears;
const majors = Degrees;

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

  const honorsCheck: { [key: string]: boolean } = {
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
      honorsCheck[val as string] = true;
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
  const handleStandardChange = (event: SelectChangeEvent<string>) => {
    handleChange({ ...props, [event.target.name]: event.target.value });
  };

  // Handles change for Button
  const handleButtonChange = (
    _event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    buttonName: string,
    value: boolean,
    ...clearValues: string[]
  ) => {
    const clear: { [key: string]: string } = {};
    for (const val of clearValues) {
      clear[val] = '';
    }

    handleChange({ ...props, [buttonName]: value, ...clear });
  };

  // Handles change for Autocomplete
  const handleAutocompleteChange = (event: React.SyntheticEvent<Element>, value: string | null) => {
    handleChange({
      ...props,
      fastTrackMajor: value ?? '',
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

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="animate-intro w-full">
      <h2 className="text-4xl text-left font-bold mb-10 text-gray-800">
        <div>Scholarships </div>
        <div> &#38; Honors</div>{' '}
      </h2>
      <div className="grid grid-cols-2 gap-x-32">
        <div>
          <h3 className="text-xl  text-gray-800 ">Are you receiving any scholarships?</h3>
          <div className="flex mt-2 mb-6 ">
            <button
              onClick={(event) => handleButtonChange(event, 'scholarship', true)}
              className={`${
                scholarship ? 'bg-yellow-400' : null
              }    hover:bg-yellow-400 text-left text-grey-700 text-sm font-medium hover:text-white h-8  px-6 border border-blue-600 hover:border-transparent rounded`}
            >
              YES
            </button>

            <button
              onClick={(event) => {
                handleButtonChange(event, 'scholarship', false, 'scholarshipType');
              }}
              className={`${
                scholarship == false ? 'bg-yellow-400' : null
              }  ml-5 hover:bg-yellow-400 text-left text-grey-700 text-sm font-medium hover:text-white h-8  px-6 border border-blue-600 hover:border-transparent rounded`}
            >
              NO
            </button>
          </div>
        </div>
        <div>
          {scholarship && (
            <h3 className="text-xl text-gray-800">What type of scholarship did you receive?</h3>
          )}
          {scholarship && (
            <FormControl variant="outlined">
              <InputLabel id="demo-simple-select-autowidth-label">Scholarship Type</InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={scholarshipType}
                onChange={handleStandardChange}
                name="scholarshipType"
                label="Type of Scholarship"
                className="w-72"
              >
                {returnMenuItems(scholarships)}
              </Select>
            </FormControl>
          )}
        </div>
        <div>
          <h3 className="text-xl text-gray-800">Are you receiving financial aid?</h3>
          <div className="flex mt-2 items-center mb-10 ">
            <button
              onClick={(event) => handleButtonChange(event, 'receivingAid', true)}
              className={`${
                receivingAid ? 'bg-yellow-400' : null
              }  hover:bg-yellow-400 text-left text-grey-700 text-sm font-medium hover:text-white h-8  px-6 border border-blue-600 hover:border-transparent rounded`}
            >
              YES
            </button>
            <button
              onClick={(event) => handleButtonChange(event, 'receivingAid', false)}
              className={`${
                receivingAid == false ? 'bg-yellow-400' : null
              }  ml-5 hover:bg-yellow-400 text-left text-grey-700 text-sm font-medium hover:text-white h-8  px-6 border border-blue-600 hover:border-transparent rounded`}
            >
              NO
            </button>
          </div>
        </div>
        <div></div>
        <div>
          <h3 className="text-xl text-gray-800">
            Are you in / plan on enrolling in the fast track program?
          </h3>
          <div className="flex mt-2 items-center mb-10 ">
            <button
              onClick={(event) => handleButtonChange(event, 'fastTrack', true)}
              className={`${
                fastTrack ? 'bg-yellow-400' : null
              } hover:bg-yellow-400 text-left text-grey-700 text-sm font-medium hover:text-white h-8  px-6 border border-blue-600 hover:border-transparent rounded`}
            >
              YES
            </button>

            <button
              onClick={(event) => {
                handleButtonChange(event, 'fastTrack', false, 'fastTrackMajor', 'fastTrackYear');
              }}
              className={`${
                fastTrack == false ? 'bg-yellow-400' : null
              }  ml-5 hover:bg-yellow-400 text-left text-grey-700 text-sm font-medium hover:text-white h-8  px-6 border border-blue-600 hover:border-transparent rounded`}
            >
              NO
            </button>
          </div>
        </div>
        <div>
          {fastTrack && <h3 className="text-xl mb-4 text-gray-800">For what major and year?</h3>}
          {fastTrack && (
            <div className="mb-4 max-w-lg h-32 w-84 rounded-lg shadow-lg border border-blue-600 p-4 ">
              <div className="mb-2">
                <Autocomplete
                  size={'small'}
                  value={fastTrackMajor}
                  className="w-72"
                  onChange={handleAutocompleteChange}
                  id="combo-box-demo"
                  options={majors}
                  style={{ width: 290 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Major" variant="outlined" />
                  )}
                />
              </div>

              <div className="">
                <FormControl className="w-32">
                  <InputLabel id="demo-simple-select-autowidth-label">Year</InputLabel>
                  <Select
                    label="year"
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
            </div>
          )}
        </div>
        <div>
          <h3 className="text-xl mb-2  text-gray-800">Are you in any honors programs?</h3>

          <FormControl margin="none" component="fieldset">
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
                  <Checkbox
                    checked={honorsCheck['lahc']}
                    onChange={handleCheckChange}
                    name="lahc"
                  />
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
    </div>
  );
}
