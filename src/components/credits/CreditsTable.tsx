import { trpc } from '@/utils/trpc';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { SemesterCode, SemesterType } from '@prisma/client';
import { FC, useMemo, useState } from 'react';
import { displaySemesterCode } from '../planner/Tiles/SemesterTile';

import DataGrid from './DataGrid';
import SearchBar from './SearchBar';
import { Credit } from './types';

const Layout: FC = ({ children }) => (
  <section className="flex flex-col gap-10 lg:gap-0">{children}</section>
);

const CreditsTable: FC = () => {
  const utils = trpc.useContext();
  const creditsQuery = trpc.credits.getCredits.useQuery();
  const allCredits = creditsQuery.data ?? [];

  const removeCredit = trpc.credits.removeCredit.useMutation({
    async onSuccess() {
      await utils.credits.getCredits.invalidate();
    },
  });

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
        const { courseCode, semesterCode } = credit;
        return {
          matchString: (semesterCode
            ? courseCode + `${displaySemesterCode(semesterCode)}`
            : courseCode + 'transfer'
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
        .map((d) => d.data as Credit),
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
              key: 'courseCode',
              valueGetter: (credit) => credit.courseCode,
            },
            {
              title: 'Transfer',
              valueGetter: (credit) => (!credit.semesterCode ? 'Yes' : 'No'),
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
                  console.log(row);
                  console.log('WTF');
                  return removeCredit.mutateAsync({
                    courseCode: row.courseCode,
                    semesterCode: row.semesterCode as SemesterCode,
                  });
                },
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
