import { displaySemesterCode } from '@/utils/utilFunctions';
import { Document, Page, StyleSheet, View } from '@react-pdf/renderer';
import React, { FC } from 'react';

import { Semester } from '../types';
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
  planTitle: string;
  semesters: Semester[];
}

// Create Document Component containing the user's degree plan
const DegreePlanPDF: FC<DegreePlanPDFProps> = ({ studentName, planTitle, semesters }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={false}>
        <View style={styles.section}>
          <Header studentName={studentName} degreePlanTitle={planTitle}></Header>
          {semesters.map((semester) => (
            <View key={displaySemesterCode(semester.code)} wrap={false}>
              <SemesterHeader title={displaySemesterCode(semester.code)}></SemesterHeader>
              <SemesterTable courses={semester.courses}></SemesterTable>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default DegreePlanPDF;
