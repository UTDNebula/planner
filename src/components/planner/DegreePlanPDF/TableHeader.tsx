import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

const borderColor = '#90e';
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomColor: '#bff0fd',
    backgroundColor: '#bff0fd',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    textAlign: 'left',

    flexGrow: 1,
  },
  courseCode: {
    width: '25%',
    fontSize: 14,
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
  },
  courseTitle: {
    width: '60%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    fontSize: 14,
    paddingLeft: 8,
  },
  courseGrade: {
    width: '15%',
    borderRightWidth: 1,
    borderRightColor: borderColor,
    fontSize: 14,
    paddingLeft: 8,
  },
});

const TableHeader = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.courseCode}>Course Code</Text>
      <Text style={styles.courseTitle}>Course Title</Text>
      <Text style={styles.courseGrade}>Credits</Text>
    </View>
  );
};

export default TableHeader;
