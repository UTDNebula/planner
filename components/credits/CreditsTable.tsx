import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { FC, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { SEMESTER_CODE_MAPPINGS } from '../../modules/common/data';
import { Credit, removeCredit } from '../../modules/redux/creditsSlice';
import { RootState } from '../../modules/redux/store';
import DataGrid from './DataGrid';
import SearchBar from './SearchBar';

const Layout: FC = ({ children }) => (
  <section className="flex flex-col gap-10 lg:gap-0">{children}</section>
);

const CreditsTable: FC = () => {
  const allCredits = useSelector((store: RootState) => store.creditsData.credits);
  const dispatch = useDispatch();

  /**
   * Naive search that compresses Credit object into a string so query string can matched against it
   */

  /**
   * Maps Credit object to
   * {
   *    matchString: string;
   *    data: Credit;
   * }
   * - if the credit is a UTD credit, matchString is a combination of the course code, semester, and year
   * - if the credit is a transfer credit, matchString is the course code followed by the word 'transfer'
   */
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

  /**
   * Filters for credits whose matchString includes the query string.
   */
  const matchingCredits: Credit[] = useMemo(
    () =>
      searchableCredits
        .filter(({ matchString }) => matchString.includes(query.toLowerCase()))
        .map((d) => d.data),
    [searchableCredits, query],
  );

  return (
    <Layout>
      <div className="grid grid-rows-2 gap-2 lg:gap-0 lg:grid-cols-2">
        <h1 className="text-[#1C2A6D] text-[30px] font-semibold">Existing Credits</h1>
        <div>
          <SearchBar
            updateQuery={(query) => setQuery(query)}
            placeholder="Search by course, semester, transfer"
            style={{ maxWidth: '450px' }}
          />
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
              valueGetter: (credit) => (!credit.semester ? 'Yes' : 'No'),
            },
            {
              title: 'Semester',
              valueGetter: (credit) =>
                credit.semester
                  ? `${SEMESTER_CODE_MAPPINGS[credit.semester.semester]} ${credit.semester.year}`
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
                onClick: (_, row) => dispatch(removeCredit(row)),
              },
            },
          }}
          rows={[...matchingCredits].reverse()}
          RowCellComponent={({ children }) => <span className="text-black">{children}</span>}
          TitleComponent={({ children }) => <h4 className="text-black">{children}</h4>}
          LoadingComponent={() => <h2 className="text-black">Loading...</h2>}
        />
      </div>
    </Layout>
  );
};

export default CreditsTable;
