import { Document, Page, StyleSheet, View } from '@react-pdf/renderer';
import React from 'react';

import { StudentPlan } from '../../../modules/common/data';
import Header from './Header';
import SemesterHeader from './SemesterHeader';
import SemesterTable from './SemesterTable';

const borderColor = '#3E61ED';
// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    paddingBottom: '60px',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  container: {
    flexDirection: 'row',
    borderBottomColor: borderColor,
    backgroundColor: borderColor,
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    textAlign: 'center',
    fontStyle: 'bold',
    flexGrow: 1,
  },
  description: {
    width: '60%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  qty: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  rate: {
    width: '15%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  amount: {
    width: '15%',
  },
});

type StudentPlanProp = {
  name: string;
  studentPlan: StudentPlan;
};

// Create Document Component containing the user's degree plan
export default function UserDegreePlanPDF({ name, studentPlan }: StudentPlanProp) {
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={false}>
        <View style={styles.section}>
          <Header name={name} degreePlan={studentPlan}></Header>
          {studentPlan.semesters.map((semester) => (
            <>
              <SemesterHeader semester={semester}></SemesterHeader>
              <SemesterTable
                items={semester.courses}
                semesterTitle={semester.title}
              ></SemesterTable>
            </>
          ))}
        </View>
      </Page>
    </Document>
  );
}
