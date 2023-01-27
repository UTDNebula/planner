import { StyleSheet, View } from '@react-pdf/renderer';
import React, { FC } from 'react';

import { getSemesterHourFromCourseCode } from '@/utils/utilFunctions';

import { Course } from '../types';
import TableFooter from './TableFooter';
import TableHeader from './TableHeader';
import TableRow from './TableRow';

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'black',
  },
});

const SemesterTable: FC<{ courses: Course[] }> = ({ courses }) => {
  const totalHours = courses.reduce(
    (total, course) => total + (getSemesterHourFromCourseCode(course.code) || 0),
    0,
  );

  return (
    <View style={styles.tableContainer}>
      <TableHeader />
      {courses.map((course, i) => {
        return (
          <TableRow
            key={course.code + i}
            catalogCode={course.code}
            title={course.code}
            creditHours={getSemesterHourFromCourseCode(course.code) || -1}
          />
        );
      })}
      <TableFooter credits={totalHours} />
    </View>
  );
};

export default SemesterTable;
