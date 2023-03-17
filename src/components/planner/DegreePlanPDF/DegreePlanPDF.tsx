import { getSemesterHourFromCourseCode } from '@/utils/utilFunctions';
import { Prisma, SemesterCode } from '@prisma/client';
import { Document, Font, Page, StyleSheet, View, Text } from '@react-pdf/renderer';
import React, { FC } from 'react';

import { Semester } from '../types';
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
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    fontFamily: 'Inter',
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
    transferCreditRow.push(transferCredits[i]);
    if (i % 3 === 2 || i + 1 === transferCredits.length) {
      transferCreditRows.push([...transferCreditRow]);
      transferCreditRow = [];
    }
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Header studentName={studentName} degreePlanTitle={planTitle}></Header>

          {/* Transfer Credit Table */}
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              marginBottom: '10px',
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: 'semibold',
                backgroundColor: '#e0e7ff',
              }}
            >
              Transfer Credits
            </Text>
            <View
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                fontSize: '11px',
                fontWeight: 'semibold',
              }}
            >
              <View style={{ flex: 5, borderLeft: '1px solid #D4D4D4' }}>
                <Text>Transfer</Text>
              </View>
              <View style={{ flex: 1, borderLeft: '1px solid #D4D4D4', textAlign: 'center' }}>
                <Text>SCH</Text>
              </View>
              <View style={{ flex: 5, borderLeft: '1px solid #D4D4D4' }}>
                <Text>Transfer</Text>
              </View>
              <View style={{ flex: 1, borderLeft: '1px solid #D4D4D4', textAlign: 'center' }}>
                <Text>SCH</Text>
              </View>{' '}
              <View style={{ flex: 5, borderLeft: '1px solid #D4D4D4' }}>
                <Text>Transfer</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  textAlign: 'center',
                  borderLeft: '1px solid #D4D4D4',
                  borderRight: '1px solid #D4D4D4',
                }}
              >
                <Text>SCH</Text>
              </View>
            </View>
            {transferCreditRows.map((row, idx) => {
              if (row.length === 3) {
                return (
                  <View
                    key={idx}
                    style={{
                      width: '100%',
                      borderTop: '1px solid #D4D4D4',
                      display: 'flex',
                      flexDirection: 'row',
                      fontSize: '9.5px',
                    }}
                  >
                    <View style={{ flex: 5, borderLeft: '1px solid #D4D4D4' }}>
                      <Text>{row[0]}</Text>
                    </View>
                    <View style={{ flex: 1, borderLeft: '1px solid #D4D4D4', textAlign: 'center' }}>
                      <Text>{getSemesterHourFromCourseCode(row[0])}</Text>
                    </View>
                    <View style={{ flex: 5, borderLeft: '1px solid #D4D4D4' }}>
                      <Text>{row[1]}</Text>
                    </View>
                    <View style={{ flex: 1, borderLeft: '1px solid #D4D4D4', textAlign: 'center' }}>
                      <Text>{getSemesterHourFromCourseCode(row[1])}</Text>
                    </View>
                    <View style={{ flex: 5, borderLeft: '1px solid #D4D4D4' }}>
                      <Text>{row[2]}</Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        borderLeft: '1px solid #D4D4D4',
                        borderRight: '1px solid #D4D4D4',
                        textAlign: 'center',
                      }}
                    >
                      <Text>{getSemesterHourFromCourseCode(row[2])}</Text>
                    </View>
                  </View>
                );
              }

              const length = row.length;
              return (
                <View
                  key={idx}
                  style={{
                    width: '100%',
                    borderTop: '1px solid #D4D4D4',
                    display: 'flex',
                    flexDirection: 'row',
                    fontSize: '9.5px',
                  }}
                >
                  <View style={{ flex: 5, borderLeft: '1px solid #D4D4D4' }}>
                    <Text>{length >= 1 && row[0]}</Text>
                  </View>
                  <View style={{ flex: 1, borderLeft: '1px solid #D4D4D4', textAlign: 'center' }}>
                    <Text>{length >= 1 && getSemesterHourFromCourseCode(row[0])}</Text>
                  </View>
                  <View style={{ flex: 5, borderLeft: '1px solid #D4D4D4' }}>
                    <Text>{length >= 2 && row[1]}</Text>
                  </View>
                  <View style={{ flex: 1, borderLeft: '1px solid #D4D4D4', textAlign: 'center' }}>
                    <Text>{length >= 2 && getSemesterHourFromCourseCode(row[1])}</Text>
                  </View>
                  <View style={{ flex: 5, borderLeft: '1px solid #D4D4D4' }}></View>
                  <View
                    style={{
                      flex: 1,
                      borderLeft: '1px solid #D4D4D4',
                      borderRight: '1px solid #D4D4D4',
                      textAlign: 'center',
                    }}
                  ></View>
                </View>
              );
            })}
            <View
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                fontSize: '11px',
                fontWeight: 'semibold',
                backgroundColor: '#e0e7ff',
              }}
            >
              <View style={{ flex: 5 }}>
                <Text>Total Credits</Text>
              </View>
              <View style={{ flex: 1 }}></View>
              <View style={{ flex: 5 }}></View>
              <View style={{ flex: 1 }}></View> <View style={{ flex: 5 }}></View>
              <View style={{ flex: 1 }}>
                <Text>
                  {transferCredits
                    .map((credit) => getSemesterHourFromCourseCode(credit) ?? 3)
                    .reduce((a, b) => a + b, 0)}
                </Text>
              </View>
            </View>
          </View>

          {academicYears.map((year, _) => {
            // Get max number of rows
            const maxRows = Math.max(year.fall.length, year.spring.length, year.summer.length);
            const rows = [];

            for (let i = 0; i < maxRows; i++) {
              const fallCourse =
                i < year.fall.length ? (
                  <>
                    <View
                      style={{
                        flex: 5,
                        fontSize: '10px',
                        paddingLeft: '2px',
                        borderLeft: '1px solid #D4D4D4',
                        flexDirection: 'row',
                        display: 'flex',
                        flexWrap: 'wrap',
                      }}
                    >
                      <Text>
                        <Text style={{ color: '#6466f1', paddingRight: '4px' }}>
                          {year.fall[i].code}
                        </Text>
                        <Text> </Text>
                        {year.fall[i].title}
                      </Text>
                    </View>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: '10px',
                        paddingLeft: '2px',
                        borderLeft: '1px solid #D4D4D4',
                        textAlign: 'center',
                      }}
                    >
                      {year.fall[i].credits}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text
                      style={{
                        flex: 5,
                        fontSize: '10px',
                        paddingLeft: '2px',
                        borderLeft: '1px solid #D4D4D4',
                      }}
                    >
                      {' '}
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: '10px',
                        paddingLeft: '2px',
                        borderLeft: '1px solid #D4D4D4',
                      }}
                    >
                      {' '}
                    </Text>
                  </>
                );
              const springCourse =
                i < year.spring.length ? (
                  <>
                    <View
                      style={{
                        flex: 5,
                        fontSize: '10px',
                        paddingLeft: '2px',
                        borderLeft: '1px solid #D4D4D4',
                        flexDirection: 'row',
                        display: 'flex',
                        flexWrap: 'wrap',
                      }}
                    >
                      <Text>
                        <Text style={{ color: '#6466f1' }}>{year.spring[i].code}</Text>
                        <Text> </Text>
                        {year.spring[i].title}
                      </Text>
                    </View>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: '10px',
                        paddingLeft: '2px',
                        borderLeft: '1px solid #D4D4D4',
                        textAlign: 'center',
                      }}
                    >
                      {year.spring[i].credits}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text
                      style={{
                        flex: 5,
                        fontSize: '10px',
                        paddingLeft: '2px',
                        borderLeft: '1px solid #D4D4D4',
                      }}
                    >
                      {' '}
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: '10px',
                        paddingLeft: '2px',
                        borderLeft: '1px solid #D4D4D4',
                      }}
                    >
                      {' '}
                    </Text>
                  </>
                );
              const summerCourse =
                i < year.summer.length ? (
                  <>
                    <View
                      style={{
                        flex: 5,
                        fontSize: '10px',
                        paddingLeft: '2px',
                        borderLeft: '1px solid #D4D4D4',
                        flexDirection: 'row',
                        display: 'flex',
                        flexWrap: 'wrap',
                      }}
                    >
                      <Text>
                        <Text style={{ color: '#6466f1', marginRight: '4px' }}>
                          {year.summer[i].code}
                        </Text>
                        <Text> </Text>
                        {year.summer[i].title}
                      </Text>
                    </View>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: '10px',
                        paddingLeft: '2px',
                        borderLeft: '1px solid #D4D4D4',
                        borderRight: '1px solid #D4D4D4',
                        textAlign: 'center',
                      }}
                    >
                      {year.summer[i].credits}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text
                      style={{
                        flex: 5,
                        fontSize: '10px',
                        paddingLeft: '2px',
                        borderLeft: '1px solid #D4D4D4',
                      }}
                    >
                      {' '}
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: '10px',
                        paddingLeft: '2px',
                        borderLeft: '1px solid #D4D4D4',
                        borderRight: '1px solid #D4D4D4',
                      }}
                    >
                      {' '}
                    </Text>
                  </>
                );
              const row = (
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    borderBottom: '1px solid #D4D4D4',
                  }}
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

                    // fontStyle: 'bold',
                    textAlign: 'center',
                    border: '1px solid #D4D4D4',
                    borderBottom: '0px',
                    backgroundColor: '#e0e7ff',
                  }}
                >
                  <Text style={{ fontSize: 10, fontWeight: 'semibold' }}>{`${year.startingYear} - ${
                    year.startingYear + 1
                  }`}</Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    border: '1px solid #D4D4D4',
                  }}
                >
                  <Text
                    style={{
                      fontSize: '10px',
                      flex: 5,
                      marginLeft: '-2px',
                      paddingRight: '4px',
                      fontWeight: 'semibold',
                    }}
                  >
                    {' '}
                    {`Fall ${year.startingYear}`}
                  </Text>
                  <Text
                    style={{
                      fontSize: '10px',
                      flex: 1,
                      paddingLeft: '2px',
                      borderLeft: '1px solid #D4D4D4',
                      fontWeight: 'semibold',
                      textAlign: 'center',
                    }}
                  >
                    SCH
                  </Text>
                  <Text
                    style={{
                      fontSize: '10px',
                      flex: 5,
                      paddingLeft: '2px',
                      borderLeft: '1px solid #D4D4D4',
                      fontWeight: 'semibold',
                    }}
                  >
                    {`Spring ${year.startingYear + 1}`}
                  </Text>
                  <Text
                    style={{
                      fontSize: '10px',
                      flex: 1,
                      paddingLeft: '2px',
                      borderLeft: '1px solid #D4D4D4',
                      fontWeight: 'semibold',
                      textAlign: 'center',
                    }}
                  >
                    SCH
                  </Text>
                  <Text
                    style={{
                      fontSize: '10px',
                      flex: 5,
                      paddingLeft: '2px',
                      borderLeft: '1px solid #D4D4D4',
                      fontWeight: 'semibold',
                    }}
                  >
                    {`Summer ${year.startingYear + 1}`}
                  </Text>
                  <Text
                    style={{
                      fontSize: '10px',
                      flex: 1,
                      paddingLeft: '2px',
                      borderLeft: '1px solid #D4D4D4',
                      fontWeight: 'semibold',
                      textAlign: 'center',
                    }}
                  >
                    SCH
                  </Text>
                </View>

                {rows}
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    borderTop: '0px',
                    border: '1px solid #D4D4D4',
                    backgroundColor: '#e0e7ff',
                  }}
                >
                  <View style={{ flex: 5 }}></View>
                  <Text
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      fontSize: '10px',
                      fontWeight: 'semibold',
                    }}
                  >
                    {year.fall.map((c) => c.credits).reduce((a, b) => a + b, 0)}
                  </Text>
                  <View style={{ flex: 5 }}></View>
                  <Text
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      fontSize: '10px',
                      fontWeight: 'semibold',
                    }}
                  >
                    {year.spring.map((c) => c.credits).reduce((a, b) => a + b, 0)}
                  </Text>
                  <View style={{ flex: 5 }}></View>
                  <Text
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      fontSize: '10px',
                      fontWeight: 'semibold',
                    }}
                  >
                    {year.summer.map((c) => c.credits).reduce((a, b) => a + b, 0)}
                  </Text>
                </View>
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
