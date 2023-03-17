import { trpc } from '@/utils/trpc';
import { displaySemesterCode, getSemesterHourFromCourseCode } from '@/utils/utilFunctions';
import { Prisma, SemesterCode } from '@prisma/client';
import { Document, Font, Page, StyleSheet, View, Text } from '@react-pdf/renderer';
import React, { FC } from 'react';

import { Semester } from '../types';
import Header from './Header';
import SemesterHeader from './SemesterHeader';
import SemesterTable from './SemesterTable';

// Font.register({
//   family: 'Inter',
//   fonts: [{ src: '@public/assets/fonts/Inter/InterRegular.ttf' }],
// });

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    // fontFamily: 'Inter',
    fontFamily: 'Times-Roman',
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
  coursesData,
}) => {
  // Separate semesters into academic years

  const academicYears = convertSemestersToAcademicYears(semesters, coursesData);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Header studentName={studentName} degreePlanTitle={planTitle}></Header>
          {academicYears.map((year, _) => {
            // Get max number of rows
            const maxRows = Math.max(year.fall.length, year.spring.length, year.summer.length);
            const rows = [];

            for (let i = 0; i < maxRows; i++) {
              const fallCourse =
                i < year.fall.length ? (
                  <>
                    <Text
                      style={{
                        flex: 5,
                        fontSize: '10px',
                        paddingLeft: '2px',
                        borderLeft: '1px solid black',
                      }}
                    >
                      {year.fall[i].code} | {year.fall[i].title}
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: '10px',
                        paddingLeft: '2px',
                        borderLeft: '1px solid black',
                      }}
                    >
                      {getSemesterHourFromCourseCode(year.fall[i].code)}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text
                      style={{
                        flex: 5,
                        fontSize: '10px',
                        paddingLeft: '2px',
                        borderLeft: '1px solid black',
                      }}
                    >
                      {' '}
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: '10px',
                        paddingLeft: '2px',
                        borderLeft: '1px solid black',
                      }}
                    >
                      {' '}
                    </Text>
                  </>
                );
              const springCourse =
                i < year.spring.length ? (
                  <>
                    <Text
                      style={{
                        flex: 5,
                        fontSize: '10px',
                        paddingLeft: '2px',
                        borderLeft: '1px solid black',
                      }}
                    >
                      {year.spring[i].code} | {year.spring[i].title}
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: '10px',
                        paddingLeft: '2px',
                        borderLeft: '1px solid black',
                      }}
                    >
                      {getSemesterHourFromCourseCode(year.spring[i].code)}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text
                      style={{
                        flex: 5,
                        fontSize: '10px',
                        paddingLeft: '2px',
                        borderLeft: '1px solid black',
                      }}
                    >
                      {' '}
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: '10px',
                        paddingLeft: '2px',
                        borderLeft: '1px solid black',
                      }}
                    >
                      {' '}
                    </Text>
                  </>
                );
              const summerCourse =
                i < year.summer.length ? (
                  <>
                    <Text
                      style={{
                        flex: 5,
                        fontSize: '10px',
                        paddingLeft: '2px',
                        borderLeft: '1px solid black',
                      }}
                    >
                      {year.summer[i].code} | {year.summer[i].title}
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: '10px',
                        paddingLeft: '2px',
                        borderLeft: '1px solid black',
                        borderRight: '1px solid black',
                      }}
                    >
                      {getSemesterHourFromCourseCode(year.summer[i].code)}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text
                      style={{
                        flex: 5,
                        fontSize: '10px',
                        paddingLeft: '2px',
                        borderLeft: '1px solid black',
                      }}
                    >
                      {' '}
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: '10px',
                        paddingLeft: '2px',
                        borderLeft: '1px solid black',
                        borderRight: '1px solid black',
                      }}
                    >
                      {' '}
                    </Text>
                  </>
                );
              const row = (
                <View
                  style={{ display: 'flex', flexDirection: 'row', borderBottom: '1px solid black' }}
                >
                  {fallCourse}
                  {springCourse}
                  {summerCourse}
                </View>
              );
              rows.push(row);
            }

            return (
              <View key={year.startingYear} wrap={false} style={{ marginBottom: '10px' }}>
                <View
                  style={{
                    width: '100%',
                    fontSize: 12,
                    fontStyle: 'bold',
                    textAlign: 'center',
                    border: '1px solid black',
                    borderBottom: '0px',
                    backgroundColor: '#e0e7ff',
                  }}
                >
                  <Text>{`${year.startingYear} - ${year.startingYear + 1}`}</Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    border: '1px solid black',
                  }}
                >
                  <Text
                    style={{ fontSize: '14px', flex: 5, marginLeft: '-2px', paddingRight: '4px' }}
                  >
                    {' '}
                    {`Fall ${year.startingYear}`}
                  </Text>
                  <Text
                    style={{
                      fontSize: '14px',
                      flex: 1,
                      paddingLeft: '2px',
                      borderLeft: '1px solid black',
                    }}
                  >
                    SCH
                  </Text>
                  <Text
                    style={{
                      fontSize: '14px',
                      flex: 5,
                      paddingLeft: '2px',
                      borderLeft: '1px solid black',
                    }}
                  >
                    {`Spring ${year.startingYear + 1}`}
                  </Text>
                  <Text
                    style={{
                      fontSize: '14px',
                      flex: 1,
                      paddingLeft: '2px',
                      borderLeft: '1px solid black',
                    }}
                  >
                    SCH
                  </Text>
                  <Text
                    style={{
                      fontSize: '14px',
                      flex: 5,
                      paddingLeft: '2px',
                      borderLeft: '1px solid black',
                    }}
                  >
                    {`Summer ${year.startingYear + 1}`}
                  </Text>
                  <Text
                    style={{
                      fontSize: '14px',
                      flex: 1,
                      paddingLeft: '2px',
                      borderLeft: '1px solid black',
                    }}
                  >
                    SCH
                  </Text>
                </View>
                {rows}
              </View>
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
