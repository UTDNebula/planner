import { Document, Page, StyleSheet, View } from '@react-pdf/renderer';
import React from 'react';

import { createSamplePlan } from '../../../modules/common/data';
import Header from './Header';
import SemesterTable from './SemesterTable';

const exampleStudent = createSamplePlan();
const borderColor = '#90e5fc';
// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  h1: {
    fontSize: 24,
    color: 'purple',
    paddingBottom: 25,
  },
  h2: {
    fontSize: 16,
    color: 'orange',
    paddingBottom: 50,
    paddingTop: 10,
  },
  header: {
    fontSize: 12,
    color: 'green',
    display: 'flex',
    flexWrap: 'wrap',
    flexGrow: 1,
    paddingBottom: '10',
  },
  tablet: {
    width: '24%',
    fontSize: 12,
    color: 'red',
    paddingBottom: 15,
    display: 'inline-block',
    flexWrap: 'wrap',
  },
  clickable: {
    cursor: 'pointer',
    margin: 10,
  },

  ////////////////

  container: {
    flexDirection: 'row',
    borderBottomColor: '#bff0fd',
    backgroundColor: '#bff0fd',
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

// Create Document Component
export default function MyDocument() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          {/* {showMajor()} */}
          <Header title={'Plan'}></Header>
          {exampleStudent.semesters.map((semester) => (
            <>
              <SemesterTable items={semester.courses} semesterTitle={'20xx'}></SemesterTable>
            </>
          ))}
        </View>
      </Page>
    </Document>
  );
}
