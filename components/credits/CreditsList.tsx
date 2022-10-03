import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import { FC, useState } from 'react';
import { useSelector } from 'react-redux';

import { SEMESTER_CODE_MAPPINGS } from '../../modules/common/data';
import { Credit } from '../../modules/redux/creditsSlice';
import { RootState } from '../../modules/redux/store';
import SearchBar from '../search/SearchBar';
import DataGrid1 from './DataGrid';

const Layout: FC = ({ children }) => (
  <section className="flex flex-col bg-white rounded-lg gap-10 shadow-lg p-10">{children}</section>
);

const CreditsList: FC = () => {
  const allCredits = useSelector((store: RootState) => store.creditsData.credits);

  const searchable = allCredits.map((credit) => {
    const { utdCourseCode, semester } = credit;
    return {
      matchString: (semester
        ? utdCourseCode + `${SEMESTER_CODE_MAPPINGS[semester.semester]} ${semester.year}`
        : utdCourseCode
      )
        .replace(/ /g, '')
        .toLowerCase(),
      data: credit,
    };
  });

  const [query, setQuery] = useState('');

  const matchingCredits: Credit[] = searchable
    .filter(({ matchString }) => matchString.includes(query.toLowerCase()))
    .map((d) => d.data);

  return (
    <Layout>
      <div className="grid grid-cols-2">
        <h1 className="text-black text-4xl font-semibold">Credits</h1>
        <div>
          <SearchBar updateQuery={(query) => setQuery(query)} />
        </div>
      </div>

      <Box sx={{ width: 'auto' }}>
        <DataGrid1
          columns={[
            {
              title: 'Course Number',
              key: 'utdCourseCode',
            },
            {
              title: 'Transfer',
              valueGetter: (credit) => (typeof credit.semester === 'undefined' ? 'Yes' : 'No'),
            },
            {
              title: 'Semester',
              valueGetter: (credit) =>
                credit.semester
                  ? `${SEMESTER_CODE_MAPPINGS[credit.semester.semester]} ${credit.semester.year}`
                  : 'Transfered in',
            },
          ]}
          childrenProps={{
            headerProps: {
              style: {
                padding: '10px',
              },
            },
            rowProps: {
              style: {
                borderTop: '1px solid #000',
                padding: '10px',
              },
              injectedComponent: () => (
                <DeleteIcon className="text-black absolute right-5 top-1/2 -translate-y-1/2" />
              ),
            },
          }}
          rows={matchingCredits.reverse()}
          rowCellComponent={({ children }) => <div className="text-black">{children}</div>}
          titleComponent={({ children }) => <span className="text-black">{children}</span>}
          loadingComponent={() => <h2 className="text-black">Loading...</h2>}
        />
      </Box>
    </Layout>
  );
};

export default CreditsList;
