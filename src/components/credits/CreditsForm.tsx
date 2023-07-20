import InfoIcon from '@mui/icons-material/Info';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { FC, useMemo, useState } from 'react';

import { trpc } from '@/utils/trpc';
import {
  createSemesterCodeRange,
  displaySemesterCode,
  getStartingPlanSemester,
} from '@/utils/utilFunctions';
import { SemesterCode } from 'prisma/utils';

import AutoCompleteSearchBar from './AutoCompleteSearchBar';
import DropdownSelect from './DropdownSelect';
import Button from '../Button';
import useSearch from '../search/search';

const Layout: FC = ({ children }) => <section className="flex flex-col gap-10">{children}</section>;

const CreditsForm: FC = () => {
  const [credit, setCredit] = useState<string | null>();
  const [isTransfer, setIsTransfer] = useState(false);

  const user = trpc.user.getUser.useQuery();

  const semesters = useMemo(
    () =>
      createSemesterCodeRange(
        user.data?.profile?.startSemesterCode ?? { semester: 'f', year: 2022 },
        getStartingPlanSemester(),
        true,
      ),
    [],
  );

  const [semester, setSemester] = useState<SemesterCode>(semesters[0]);

  const utils = trpc.useContext();

  const addCredit = trpc.credits.addCredit.useMutation({
    async onSuccess() {
      await utils.credits.getCredits.invalidate();
    },
  });

  const q = trpc.courses.publicGetAllCourses.useQuery(undefined, {
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const { results, updateQuery } = useSearch({
    getData: async () =>
      q.data ? q.data.map((c) => ({ code: `${c.subject_prefix} ${c.course_number}` })) : [],
    initialQuery: '',
    filterFn: (course, query) => course.code.toLowerCase().includes(query.toLowerCase()),
  });

  const submit = () => {
    if (credit) {
      addCredit.mutateAsync({
        courseCode: credit,
        semesterCode: semester,
        transfer: isTransfer,
      });
    }
  };

  return (
    <Layout>
      <h1 className="text-4xl font-semibold text-[#1C2A6D]">Add Credit</h1>

      <AutoCompleteSearchBar
        onValueChange={(value) => setCredit(value)}
        onInputChange={(query) => updateQuery(query)}
        options={results.map((course) => course.code)}
        style={{ maxWidth: '450px', minWidth: '350px' }}
        autoFocus
      />

      <FormControl className="flex flex-col items-start gap-3">
        <label htmlFor="transfer" className="font-medium text-black">
          Is Transfer Credit?{' '}
          <div
            className="tooltip tooltip-top"
            data-tip="If you have transfer credits, select the course that the transfer credit corresponds to and the semester it was transferred in."
          >
            <InfoIcon fontSize="small" />
          </div>
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

        <>
          <label htmlFor="semester" className="font-medium text-black">
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
      </FormControl>
      <Button onClick={submit}>{'Add Credit'}</Button>
    </Layout>
  );
};

export default CreditsForm;
