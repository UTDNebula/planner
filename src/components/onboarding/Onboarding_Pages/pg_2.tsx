import DataGrid from '@/components/credits/DataGrid';
import DropdownSelect from '@/components/credits/DropdownSelect';
import { Credit } from '@/components/credits/types';
import { displaySemesterCode } from '@/components/planner/Tiles/SemesterTile';
import { generateSemesters } from '@/modules/common/data';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import React, { useMemo, useState } from 'react';

import { SemesterCode, SemesterType } from '@prisma/client';
import useSearch from '@/components/search/search';
import { loadDummyCourses } from '@/utils/utilFunctions';
import SearchBar from '@/components/credits/SearchBar';
import { FormControlLabel, Switch } from '@mui/material';
import AutoCompleteSearchBar from '@/components/credits/AutoCompleteSearchBar';
import Button from '@/components/credits/Button';

// Array of values to choose from for form

export type PageTwoTypes = {
  credits: Credit[];
};

export type Page2data = {
  handleChange: React.Dispatch<React.SetStateAction<PageTwoTypes>>;
  data: PageTwoTypes;
};

export default function PageTwo({ handleChange, data }: Page2data): JSX.Element {
  const { credits } = data;

  // TODO: Change start semester to when they first joined UTD - 2
  const semesters = useMemo(
    () =>
      generateSemesters(8, new Date().getFullYear() - 4, SemesterType.f)
        .reverse()
        .map((sem) => sem.code),
    [],
  );

  const [semesterCode, setSemester] = useState<SemesterCode>(semesters[0]);

  const { results, updateQuery } = useSearch({
    getData: loadDummyCourses,
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
        });
    }
  };

  const handleRemoveCredit = (removeCredit: Credit) => {
    handleChange({
      credits: credits.filter((credit) => credit !== removeCredit),
    });
  };

  return (
    <div className="animate-intro flex flex-col">
      <div className="text-lg">Add Credits</div>
      <div>Add credits that you have already taken in your degree plan here!</div>

      <div className="w-72">
        <AutoCompleteSearchBar
          onValueChange={(value) => setCourseCode(value)}
          onInputChange={(query: string) => updateQuery(query)}
          options={results.map((course) => course.code)}
          style={{ maxWidth: '450px', minWidth: '350px' }}
          autoFocus
        />
      </div>

      <div className="flex flex-row">
        <DropdownSelect
          id="semester"
          value={semesterCode}
          values={semesters as (SemesterCode & { [key: string]: string })[]}
          getValue={(semester) => semester}
          getDisplayedValue={(semester) => displaySemesterCode(semester)}
          onChange={(sem) => setSemester(sem)}
        />
        <FormControlLabel
          control={<Switch onChange={() => setTransfer(!transfer)} />}
          label="Label"
        />
      </div>

      <Button onClick={handleAddCredit}>{'Add Credit'}</Button>

      <div className="gap-2 px-2 py-4 max-h-[400px]">
        <DataGrid
          columns={[
            {
              title: 'Course Number',
              key: 'courseCode',
              valueGetter: (credit) => credit.courseCode,
            },
            {
              title: 'Transfer',
              valueGetter: (credit) => (!credit.transfer ? 'Yes' : 'No'),
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
                  <DeleteIcon className="text-red-500 cursor-pointer absolute right-5 top-1/2 -translate-y-1/2" />
                ),
                onClick: (_, row) => {
                  handleRemoveCredit(row);
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
  );
}
