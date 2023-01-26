import { Document, Page, StyleSheet, View } from '@react-pdf/renderer';
import React, { FC } from 'react';
import { PlanSemester } from '../types';

import Header from './Header';
import SemesterHeader from './SemesterHeader';
import SemesterTable from './SemesterTable';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

interface DegreePlanPDFProps {
  studentName: string;
  major: string;
  planTitle: string;
  semesters: PlanSemester[];
}

// Create Document Component containing the user's degree plan
const DegreePlanPDF: FC<DegreePlanPDFProps> = ({ studentName, major, planTitle, semesters }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={false}>
        <View style={styles.section}>
          <Header studentName={studentName} major={major} degreePlanTitle={planTitle}></Header>
          {semesters.map((semester) => (
            <View key={semester.code.semester} wrap={false}>
              <SemesterHeader title={semester.code.semester}></SemesterHeader>
              <SemesterTable courses={semester.courses}></SemesterTable>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default DegreePlanPDF;
