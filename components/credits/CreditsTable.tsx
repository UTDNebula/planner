import DeleteIcon from '@mui/icons-material/Delete';
import { FC, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { SEMESTER_CODE_MAPPINGS } from '../../modules/common/data';
import { Credit, removeCredit } from '../../modules/redux/creditsSlice';
import { RootState } from '../../modules/redux/store';
import SearchBar from '../search/SearchBar';
import DataGrid from './DataGrid';

const Layout: FC = ({ children }) => (
  <section className="flex flex-col bg-white rounded-lg gap-10 shadow-lg p-10">{children}</section>
);

const CreditsTable: FC = () => {
  const allCredits = useSelector((store: RootState) => store.creditsData.credits);
  const dispatch = useDispatch();

  const searchableCredits = useMemo(
    () =>
      allCredits.map((credit) => {
        const { utdCourseCode, semester } = credit;
        return {
          matchString: (semester
            ? utdCourseCode + `${SEMESTER_CODE_MAPPINGS[semester.semester]} ${semester.year}`
            : utdCourseCode + 'transfer'
          ).toLowerCase(),
          data: credit,
        };
      }),
    [allCredits],
  );

  const [query, setQuery] = useState('');

  const matchingCredits: Credit[] = useMemo(
    () =>
      searchableCredits
        .filter(({ matchString }) => matchString.includes(query.toLowerCase()))
        .map((d) => d.data),
    [searchableCredits, query],
  );

  return (
    <Layout>
      <div className="grid grid-cols-2">
        <h1 className="text-black text-4xl font-semibold">Credits</h1>
        <div>
          <SearchBar updateQuery={(query) => setQuery(query)} />
        </div>
      </div>

      <div>
        <DataGrid
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
                padding: '10px 0',
              },
            },
            rowProps: {
              style: {
                borderTop: '1px solid #000',
                padding: '10px 0',
              },
              injectedComponent: {
                Element: () => (
                  <DeleteIcon className="text-black cursor-pointer absolute right-5 top-1/2 -translate-y-1/2" />
                ),
                onClick: (_, row) => dispatch(removeCredit(row)),
              },
            },
          }}
          rows={matchingCredits.reverse()}
          RowCellComponent={({ children }) => <div className="text-black">{children}</div>}
          TitleComponent={({ children }) => <span className="text-black">{children}</span>}
          LoadingComponent={() => <h2 className="text-black">Loading...</h2>}
        />
      </div>
    </Layout>
  );
};

export default CreditsTable;
