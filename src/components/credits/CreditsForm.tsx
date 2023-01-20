import { trpc } from '@/utils/trpc';
import { loadDummyCourses } from '@/utils/utilFunctions';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { SemesterCode, SemesterType } from '@prisma/client';
import { FC, useMemo, useState } from 'react';

import { generateSemesters } from '../../modules/common/data';
import { convertSemesterToData } from '../../modules/common/data-utils';
import { displaySemesterCode } from '../planner/Tiles/SemesterTile';
import { Semester } from '../planner/types';
import useSearch from '../search/search';
import AutoCompleteSearchBar from './AutoCompleteSearchBar';
import Button from './Button';
import DropdownSelect from './DropdownSelect';

const Layout: FC = ({ children }) => <section className="flex flex-col gap-10">{children}</section>;

const CreditsForm: FC = () => {
  const [credit, setCredit] = useState<string | null>();
  const [isTransfer, setIsTransfer] = useState(false);

  const semesters = useMemo(
    () =>
      generateSemesters(8, new Date().getFullYear() - 4, SemesterType.f)
        .reverse()
        .map((sem) => sem.code),
    [],
  );

  const [semester, setSemester] = useState<SemesterCode>(semesters[0]);

  const utils = trpc.useContext();

  const addCredit = trpc.credits.addCredit.useMutation({
    async onSuccess() {
      await utils.credits.getCredits.invalidate();
    },
  });

  const { results, updateQuery } = useSearch({
    getData: loadDummyCourses,
    initialQuery: '',
    filterFn: (course, query) => course.code.toLowerCase().includes(query.toLowerCase()),
  });

  const submit = () => {
    if (credit) {
      addCredit.mutateAsync({
        courseCode: credit,
        semesterCode: isTransfer ? null : semester,
      });
    }
  };

  return (
    <Layout>
      <h1 className="text-[#1C2A6D] text-4xl font-semibold">Add Credit</h1>

      <AutoCompleteSearchBar
        onValueChange={(value) => setCredit(value)}
        onInputChange={(query) => updateQuery(query)}
        options={results.map((course) => course.code)}
        style={{ maxWidth: '450px', minWidth: '350px' }}
        autoFocus
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
          <FormControlLabel
            className="text-black"
            value="yes"
            control={
              <Radio
                sx={{
                  '&.Mui-checked': {
                    color: '#3E61ED',
                  },
                }}
              />
            }
            label="Yes"
          />
          <FormControlLabel
            className="text-black"
            value="no"
            control={
              <Radio
                sx={{
                  '&.Mui-checked': {
                    color: '#3E61ED',
                  },
                }}
              />
            }
            label="No"
          />
        </RadioGroup>
        {!isTransfer && (
          <>
            <label htmlFor="semester" className="text-black font-medium">
              Semester
            </label>
            <DropdownSelect
              id="semester"
              value={semester}
              values={semesters as (SemesterCode & { [key: string]: string })[]}
              getValue={(semester) => semester}
              getDisplayedValue={(semester) => displaySemesterCode(semester)}
              onChange={(sem) => setSemester(sem)}
            />
          </>
        )}
      </FormControl>
      <Button onClick={submit}>{'Add Credit'}</Button>
    </Layout>
  );
};

export default CreditsForm;
