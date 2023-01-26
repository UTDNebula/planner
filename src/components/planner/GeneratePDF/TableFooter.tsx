import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  courseGrade: {
    width: '100%',
    fontSize: 12,
    fontStyle: 'bold',
    textAlign: 'right',
    paddingRight: 4,
  },
});

const TableFooter = ({ credits }: { credits: number }) => (
  <View style={styles.row}>
    <Text style={styles.courseGrade}>Total Credits: {credits}</Text>
  </View>
);

export default TableFooter;
