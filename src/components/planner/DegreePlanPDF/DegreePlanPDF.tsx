import { getSemesterHourFromCourseCode } from '@/utils/utilFunctions';
import { Prisma, SemesterCode } from '@prisma/client';
import { Document, Font, Page, StyleSheet, View, Text } from '@react-pdf/renderer';
import React, { FC } from 'react';

import { Semester } from '../types';
import AcademicYearTable from './AcademicYearTable';
import Header from './Header';

Font.register({
  family: 'Inter',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZg.ttf',
    },
    {
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZg.ttf',
      fontWeight: 'semibold',
    },
    {
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZg.ttf',
      fontWeight: 'bold',
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    fontFamily: 'Inter',
    color: '#090B2C',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

interface DegreePlanPDFProps {
  studentName: string;
  planTitle: string;
  semesters: Semester[];
  transferCredits: string[];
  coursesData: {
    title: string;
    id: string;
    course_number: string;
    prerequisites: Prisma.JsonValue;
    subject_prefix: string;
  }[];
}

interface AcademicYearData {
  startingYear: number;
  fall: CourseData[];
  spring: CourseData[];
  summer: CourseData[];
}

interface CourseData {
  code: string;
  title: string;
  credits: number;
}
[];

// Create Document Component containing the user's degree plan
const DegreePlanPDF: FC<DegreePlanPDFProps> = ({
  studentName,
  planTitle,
  semesters,
  transferCredits,
  coursesData,
}) => {
  // Separate semesters into academic years
  const academicYears = convertSemestersToAcademicYears(semesters, coursesData);

  const transferCreditRows = [];
  let transferCreditRow = [];
  for (let i = 0; i < transferCredits.length; i++) {
    transferCreditRow.push({
      code: transferCredits[i],
      title:
        coursesData.find((c) => transferCredits[i] === `${c.subject_prefix} ${c.course_number}`)
          ?.title ?? '',
    });
    transferCreditRow.push(getSemesterHourFromCourseCode(transferCredits[i]) ?? 3);
    if (i % 3 === 2 || i + 1 === transferCredits.length) {
      transferCreditRows.push([...transferCreditRow]);
      transferCreditRow = [];
    }
  }

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={false}>
        <View style={styles.section}>
          <Header studentName={studentName} degreePlanTitle={planTitle}></Header>

          {/* Transfer Credit Table */}
          {transferCreditRows.length > 0 && (
            <AcademicYearTable
              tableName="Transfer Credits"
              tableHeaders={['Transfer', 'SCH', 'Transfer', 'SCH', 'Transfer', 'SCH']}
              tableData={transferCreditRows}
            />
          )}

          {academicYears.map((year, idx) => {
            // Get max number of rows
            const maxRows = Math.max(year.fall.length, year.spring.length, year.summer.length);
            const rows = [];
            let newRow = [];

            for (let i = 0; i < maxRows; i++) {
              if (i < year.fall.length) {
                newRow.push({ code: year.fall[i].code, title: year.fall[i].title });
                newRow.push(getSemesterHourFromCourseCode(year.fall[i].code) ?? 3);
              }

              if (i < year.spring.length) {
                newRow.push({ code: year.spring[i].code, title: year.spring[i].title });
                newRow.push(getSemesterHourFromCourseCode(year.spring[i].code) ?? 3);
              }
              if (i < year.summer.length) {
                newRow.push({ code: year.summer[i].code, title: year.summer[i].title });
                newRow.push(getSemesterHourFromCourseCode(year.summer[i].code) ?? 3);
              }
              rows.push([...newRow]);
              newRow = [];
            }

            return (
              <AcademicYearTable
                key={idx}
                tableName={`${year.startingYear} - ${year.startingYear + 1}`}
                tableHeaders={[
                  `Fall ${year.startingYear}`,
                  'SCH',
                  `Spring ${year.startingYear + 1}`,
                  'SCH',
                  `Summer ${year.startingYear + 1}`,
                  'SCH',
                ]}
                tableData={rows}
              />
            );
          })}
        </View>
      </Page>
    </Document>
  );
};

const convertSemestersToAcademicYears = (
  semesters: Semester[],
  coursesData: {
    title: string;
    id: string;
    course_number: string;
    prerequisites: Prisma.JsonValue;
    subject_prefix: string;
  }[],
) => {
  const academicYears = [];

  let i = 0;

  while (i < semesters.length) {
    const academicYear: AcademicYearData = {
      startingYear: 0,
      fall: [],
      spring: [],
      summer: [],
    };
    // Initialize academic year if it's just an object
    academicYear['startingYear'] = getStartingYear(semesters[i].code);

    // Add data for fall
    if (
      i < semesters.length &&
      semesters[i].code.semester === 'f' &&
      semesters[i].code.year === academicYear['startingYear']
    ) {
      // Get course title
      academicYear.fall = addCoursesToSemester(semesters[i], coursesData);

      i++;
    } else {
      academicYear.fall = [];
    }

    // Add data for spring
    if (
      i < semesters.length &&
      semesters[i].code.semester === 's' &&
      semesters[i].code.year === academicYear['startingYear'] + 1
    ) {
      // Get course title
      academicYear.spring = addCoursesToSemester(semesters[i], coursesData);

      i++;
    } else {
      academicYear.spring = [];
    }

    // Add data for summer
    if (
      i < semesters.length &&
      semesters[i].code.semester === 'u' &&
      semesters[i].code.year === academicYear['startingYear'] + 1
    ) {
      // Get course title
      academicYear.summer = addCoursesToSemester(semesters[i], coursesData);

      i++;
    } else {
      academicYear.summer = [];
    }

    // Add to academic year
    academicYears.push(academicYear);
  }
  return academicYears;
};

const getStartingYear = (semCode: SemesterCode) => {
  if (semCode.semester === 'f') {
    return semCode.year;
  }
  return semCode.year - 1;
};

const addCoursesToSemester = (
  semester: Semester,
  coursesData: {
    title: string;
    id: string;
    course_number: string;
    prerequisites: Prisma.JsonValue;
    subject_prefix: string;
  }[],
) => {
  return semester.courses.map((course) => {
    return {
      code: course.code,
      title:
        coursesData.find((c) => `${c.subject_prefix} ${c.course_number}` === course.code)?.title ??
        '',
      credits: getSemesterHourFromCourseCode(course.code) ?? 3,
    };
  });
};

export default DegreePlanPDF;
