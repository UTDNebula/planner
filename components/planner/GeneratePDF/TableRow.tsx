import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

import { Course } from '../../../modules/common/data';

const borderColor = '#9AB888';
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomColor: '#bff0AA',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    fontSize: 12,
    fontStyle: 'bold',
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

type TableRowProps = {
  item: Course;
};

const TableRow = ({ item }: TableRowProps) => (
  <View style={styles.row}>
    <Text style={styles.courseCode}>{item.catalogCode}</Text>
    <Text style={styles.courseTitle}>{item.title}</Text>
    <Text style={styles.courseGrade}>{item.creditHours}</Text>
  </View>
);

export default TableRow;
