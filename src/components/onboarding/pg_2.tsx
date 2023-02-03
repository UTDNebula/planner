import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { FormControl, InputLabel, Switch } from '@mui/material';
import { SemesterCode, SemesterType } from '@prisma/client';
import React, { useMemo, useState } from 'react';
import AutoCompleteSearchBar from '@/components/credits/AutoCompleteSearchBar';
import Button from '@/components/credits/Button';
import DataGrid from '@/components/credits/DataGrid';
import AddIcon from '@mui/icons-material/Add';
import DropdownSelect from '@/components/credits/DropdownSelect';
import { Credit } from '@/components/credits/types';
import useSearch from '@/components/search/search';
import {
  createSemesterCodeRange,
  displaySemesterCode,
  loadDummyCourses,
} from '@/utils/utilFunctions';
import { getStartingPlanSemester } from '@/utils/plannerUtils';
import { UploadTranscriptDialog } from '../home/Credits';

// Array of values to choose from for form

export type PageTwoTypes = {
  credits: Credit[];
};

export type Page2data = {
  handleChange: React.Dispatch<React.SetStateAction<PageTwoTypes>>;
  data: PageTwoTypes;
  startSemester: SemesterCode;
};

export default function PageTwo({ handleChange, data, startSemester }: Page2data): JSX.Element {
  const { credits } = data;

  const semesters = useMemo(
    () => createSemesterCodeRange(startSemester, getStartingPlanSemester(), true),
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
  const [openTranscriptDialog, setOpenTranscriptDialog] = useState(false);

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
    <div className="flex animate-intro flex-col gap-16">
      <div>
        <div className="text-[40px]">Add Courses</div>
        <div className="text-[16px]">Add the courses that you have taken below!</div>
      </div>

      <div className="flex w-[350px] flex-col gap-4">
        <AutoCompleteSearchBar
          onValueChange={(value) => setCourseCode(value)}
          onInputChange={(query: string) => updateQuery(query)}
          options={results.map((course) => course.code)}
          style={{ maxWidth: '450px', minWidth: '350px' }}
          autoFocus
        />

        <div className="flex flex-row items-center justify-between">
          <FormControl variant="outlined" className="w-44">
            <InputLabel id="demo-simple-select-autowidth-label">Semester</InputLabel>
            <DropdownSelect
              id="semester"
              value={semesterCode}
              values={semesters as (SemesterCode & { [key: string]: string })[]}
              getValue={(semester) => semester}
              getDisplayedValue={(semester) => displaySemesterCode(semester)}
              onChange={(sem) => setSemester(sem)}
            />
          </FormControl>
          <div className="flex flex-row items-center">
            <div className="text-[16px]">Transfer</div>
            <Switch onChange={() => setTransfer(!transfer)} />
          </div>
        </div>
        <Button onClick={handleAddCredit}>{'Add Credit'}</Button>
        <UploadTranscriptDialog
          open={openTranscriptDialog}
          onClose={() => setOpenTranscriptDialog(false)}
        />
        <Button
          onClick={() => setOpenTranscriptDialog(true)}
          icon={<AddIcon />}
          className="w-[200px]"
        >
          Upload Transcript
        </Button>
      </div>

      <div className="max-h-[400px] gap-2 px-2 py-4">
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
                  <DeleteIcon className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer text-red-500" />
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
