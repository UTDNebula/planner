import SearchIcon from '@mui/icons-material/Search';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { loadDummyCourses } from '../../modules/common/api/courses';
import { addCredit } from '../../modules/redux/creditsSlice';
import { RootState } from '../../modules/redux/store';
import useSearch from '../search/search';

const Layout: FC = ({ children }) => (
  <section className="p-20 flex flex-col bg-white rounded-lg gap-10 shadow-lg">{children}</section>
);

const CreditsForm: FC = () => {
  const [credit, setCredit] = useState<string | null>();
  const [isTransfer, setAreTransfer] = useState(false);
  const creditsData = useSelector((store: RootState) => store.creditsData);
  console.log(creditsData.credits);

  const dispatch = useDispatch();

  const { results, err, updateQuery } = useSearch({
    getData: loadDummyCourses,
    initialQuery: '',
    filterFn: (course, query) => course.catalogCode.includes(query),
  });

  const submit = () => {
    if (credit) {
      dispatch(addCredit({ utdCourseCode: credit, isTransfer }));
    }
  };

  return (
    <Layout>
      <h1 className="text-black text-4xl font-semibold">Add Credits</h1>

      <div className="flex items-center gap-5 border-2 border-black rounded-full py-2 px-5">
        <SearchIcon className="text-black" />
        <Autocomplete
          style={{ width: '100%' }}
          onChange={(_, value) => setCredit(value)}
          onInputChange={(_, query) => updateQuery(query)}
          options={results.map((course) => course.catalogCode)}
          fullWidth
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                variant="standard"
                inputProps={{
                  style: {},
                  ...params.inputProps,
                }}
                placeholder="Course Code"
                InputProps={{
                  ...params.InputProps,
                  disableUnderline: true,
                }}
              />
            );
          }}
        />
      </div>

      <FormControl>
        <FormLabel className="text-black" style={{ color: 'black' }} required>
          Is Transfer Credit?
        </FormLabel>
        <RadioGroup row onChange={(_, value) => setAreTransfer(value === 'yes')}>
          <FormControlLabel value="yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="no" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>
      <Button
        onClick={submit}
        variant="contained"
        className="bg-primary-dark rounded-full w-80 h-12"
      >
        Add credits
      </Button>
    </Layout>
  );
};

export default CreditsForm;
