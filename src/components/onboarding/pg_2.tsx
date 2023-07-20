import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { FormControl, Switch } from '@mui/material';
import React, { useMemo, useState } from 'react';

import Button from '@/components/Button';
import DataGrid from '@/components/credits/DataGrid';
import { Credit } from '@/components/credits/types';
import AutoCompleteSearchBar from '@/components/onboarding/AutoCompleteSearchBarOnboarding';
import DropdownSelect from '@/components/onboarding/DropdownSelectOnboarding';
import useSearch from '@/components/search/search';
import BuddyIcon from '@/icons/BuddyIcon';
import { trpc } from '@/utils/trpc';
import { createSemesterCodeRange, displaySemesterCode , getStartingPlanSemester } from '@/utils/utilFunctions';
import { SemesterCode } from 'prisma/utils';

// Array of values to choose from for form

export type PageTwoTypes = {
  credits: Credit[];
  firstName: string;
};

export type Page2data = {
  handleChange: React.Dispatch<React.SetStateAction<PageTwoTypes>>;
  data: PageTwoTypes;
  startSemester: SemesterCode;
};

export default function PageTwo({ handleChange, data, startSemester }: Page2data): JSX.Element {
  const { credits, firstName } = data;

  const semesters = useMemo(
    () => createSemesterCodeRange(startSemester, getStartingPlanSemester(), true),
    [],
  );

  const [semesterCode, setSemester] = useState<SemesterCode>(semesters[0]);

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

  const [courseCode, setCourseCode] = useState('');
  const [transfer, setTransfer] = useState(true);

  const handleAddCredit = () => {
    if (courseCode) {
      // Check for duplicates
      if (!credits.some((credit) => credit.courseCode === courseCode))
        handleChange({
          credits: [...credits, { courseCode: courseCode, transfer, semesterCode: semesterCode }],
          firstName: firstName,
        });
    }
  };

  const handleRemoveCredit = (removeCredit: Credit) => {
    handleChange({
      credits: credits.filter((credit) => credit !== removeCredit),
      firstName: firstName,
    });
  };

  return (
    <div className="flex flex-col pb-5">
      <div>
        <div className="-mb-5"></div>
        <BuddyIcon className="flex w-full items-center justify-center"></BuddyIcon>
        <div className="pt-5" />
        <div className="flex items-center justify-center">
          <h2 className="inline text-4xl font-extrabold tracking-tight text-gray-800">
            {' '}
            Hello&nbsp;
          </h2>
          <h2 className="inline text-4xl font-extrabold tracking-tight text-[#4B4EFC]">
            {firstName}
          </h2>
        </div>
        <figcaption className="font-small">
          <div className="mb-1 flex content-center items-center justify-center py-2 text-sm text-[#737373]">
            Add additional credits
          </div>
        </figcaption>
      </div>
      <div className="flex w-fit flex-row justify-between">
        <div className="flex w-fit flex-col">
          <div className="flex w-[350px] flex-col gap-4">
            <div className="-mb-2 pt-5 text-sm font-medium">Course Code</div>
            <AutoCompleteSearchBar
              onValueChange={(value) => setCourseCode(value)}
              onInputChange={(query: string) => updateQuery(query)}
              options={results.map((course) => course.code)}
              style={{ maxWidth: '450px', minWidth: '350px' }}
              autoFocus
            />

            <figcaption className="font-small">
              <div className="-mt-2 text-sm text-[#737373]">4 digit course code</div>
            </figcaption>

            <div className="text-sm font-medium">Semester</div>
            <div className="flex flex-row items-center justify-between">
              <FormControl variant="outlined" className="-mt-2 w-[350px]">
                <DropdownSelect
                  id="semester"
                  value={semesterCode}
                  values={semesters as (SemesterCode & { [key: string]: string })[]}
                  getValue={(semester) => semester}
                  getDisplayedValue={(semester) => displaySemesterCode(semester)}
                  onChange={(sem) => setSemester(sem)}
                />
              </FormControl>
            </div>
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center">
                <Switch onChange={() => setTransfer(!transfer)} />
                <div className="text-[16px]">Transfer Credit</div>
              </div>
              <Button className="place-content-end" onClick={handleAddCredit}>
                {'Add Credit'}
              </Button>
            </div>
          </div>
        </div>
        <div className="max-h-[400px] min-w-fit px-2 py-4">
          <DataGrid
            columns={[
              {
                title: 'Course Number',
                key: 'courseCode',
                valueGetter: (credit) => credit.courseCode,
              },
              {
                title: 'Transfer',
                valueGetter: (credit) => (credit.transfer ? 'Yes' : 'No'),
              },
              {
                title: 'Semester',
                valueGetter: (credit) =>
                  credit.semesterCode
                    ? `${displaySemesterCode(credit.semesterCode)}`
                    : 'Transferred in',
              },
            ]}
            childrenProps={{
              headerProps: {
                style: {
                  padding: '20px 0',
                },
              },
              gridProps: {
                style: {},
              },
              rowProps: {
                style: {
                  borderTop: '1px solid #DEDFE1',
                  padding: '20px 0',
                },
                injectedComponent: {
                  Element: () => (
                    <DeleteIcon className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer text-red-500" />
                  ),
                  onClick: (_, row) => {
                    return handleRemoveCredit(row);
                  },
                },
              },
            }}
            rows={[...credits].reverse()}
            RowCellComponent={({ children }) => <span className="text-black">{children}</span>}
            TitleComponent={({ children }) => <h4 className="text-black">{children}</h4>}
            LoadingComponent={() => <h2 className="text-black">Loading...</h2>}
          />
        </div>
      </div>
    </div>
  );
}
