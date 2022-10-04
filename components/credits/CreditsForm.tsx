import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import { FC, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { loadDummyCourses } from '../../modules/common/api/courses';
import { generateSemesters, SemesterCode } from '../../modules/common/data';
import { convertSemesterToData } from '../../modules/common/data-utils';
import { addCredit } from '../../modules/redux/creditsSlice';
import useSearch from '../search/search';
import SearchBar from './SearchBar';

const Layout: FC = ({ children }) => <section className="flex flex-col gap-10">{children}</section>;

const CreditsForm: FC = () => {
  const [credit, setCredit] = useState<string | null>();
  const [isTransfer, setIsTransfer] = useState(false);

  const semesters = useMemo(
    () => generateSemesters(8, new Date().getFullYear() - 4, SemesterCode.f).reverse(),
    [],
  );

  const [semester, setSemester] = useState<string>(semesters[0].code);

  const dispatch = useDispatch();

  const { results, updateQuery } = useSearch({
    getData: loadDummyCourses,
    initialQuery: '',
    filterFn: (course, query) => course.catalogCode.toLowerCase().includes(query.toLowerCase()),
  });

  const submit = () => {
    if (credit) {
      dispatch(
        addCredit({
          utdCourseCode: credit,
          semester: isTransfer ? undefined : convertSemesterToData(semester),
        }),
      );
    }
  };

  return (
    <Layout>
      <h1 className="text-black text-4xl font-semibold">Add Credits</h1>

      <SearchBar
        onChange={(value) => setCredit(value)}
        onInputChange={(query) => updateQuery(query)}
        options={results.map((course) => course.catalogCode)}
      />

      <FormControl className="flex flex-col gap-3">
        <label htmlFor="transfer" className="text-black font-medium">
          Is Transfer Credit?
        </label>

        <RadioGroup
          id="transfer"
          defaultValue={'no'}
          row
          onChange={(_, value) => setIsTransfer(value === 'yes')}
        >
          <FormControlLabel className="text-black" value="yes" control={<Radio />} label="Yes" />
          <FormControlLabel className="text-black" value="no" control={<Radio />} label="No" />
        </RadioGroup>
        {!isTransfer && (
          <>
            <label htmlFor="semester" className="text-black font-medium">
              Semester
            </label>
            <Select
              id="semester"
              value={semester}
              label=""
              onChange={(e) => setSemester(e.target.value)}
            >
              {semesters.map(({ title, code }, i) => (
                <MenuItem value={code} key={code + i}>
                  {title}
                </MenuItem>
              ))}
            </Select>
          </>
        )}
      </FormControl>
      <Button
        onClick={submit}
        variant="contained"
        className="bg-primary-dark rounded-full w-3/4 min-w-52 max-w-[300px] h-12"
      >
        <span className="font-semibold">Add credits</span>
      </Button>
    </Layout>
  );
};

export default CreditsForm;
