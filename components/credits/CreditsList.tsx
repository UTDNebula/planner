import Box from '@mui/material/Box';
import { FC } from 'react';
import { useSelector } from 'react-redux';

import { SEMESTER_CODE_MAPPINGS } from '../../modules/common/data';
import { RootState } from '../../modules/redux/store';
import DataGrid1 from './DataGrid';

const Layout: FC = ({ children }) => (
  <section className="flex flex-col bg-white rounded-lg gap-10 shadow-lg">{children}</section>
);

const CreditsList: FC = () => {
  const credits = useSelector((store: RootState) => store.creditsData.credits);

  return (
    <Layout>
      <h1 className="text-black text-4xl font-semibold">Credits</h1>

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
            rowProps: {
              style: {
                borderTop: '1px solid #000',
                padding: '10px',
              },
              injectedComponent: () => (
                <div className="text-black absolute top-0 right-5">test</div>
              ),
            },
          }}
          rows={[...credits].reverse()}
          rowCellComponent={({ children }) => <div className="text-black">{children}</div>}
          titleComponent={({ children }) => <span className="text-black">{children}</span>}
          loadingComponent={() => <h2 className="text-black">Loading...</h2>}
        />
      </Box>
    </Layout>
  );
};

export default CreditsList;
