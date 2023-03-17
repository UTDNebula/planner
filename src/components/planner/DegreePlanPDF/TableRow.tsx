import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

const borderColor = '#9AB888';
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomColor: '#bff0AA',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    fontSize: 12,
  },
  courseCode: {
    width: '25%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'left',
    paddingLeft: 8,
  },
  courseTitle: {
    width: '60%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'left',
    paddingLeft: 8,
  },
  courseGrade: {
    width: '15%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'left',
    paddingLeft: 8,
  },
});

const TableRow = ({
  catalogCode,
  creditHours,
  title,
}: {
  catalogCode: string;
  creditHours: number;
  title: string;
}) => {
  return (
    <View style={styles.row}>
      <Text style={styles.courseCode}>{catalogCode}</Text>
      <Text style={styles.courseTitle}>{title}</Text>
      <Text style={styles.courseGrade}>{creditHours}</Text>
    </View>
  );
};

export default TableRow;
