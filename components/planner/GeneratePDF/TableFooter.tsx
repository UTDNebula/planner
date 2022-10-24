import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React, { Fragment } from 'react';

const borderColor = '#9AB888';
const styles = StyleSheet.create({
  // row: {
  //     flexDirection: 'row',
  //     borderBottomColor: '#bff0AA',
  //     borderBottomWidth: 1,
  //     alignItems: 'center',
  //     height: 24,
  //     fontSize: 12,
  //     fontStyle: 'bold',
  // },
  courseGrade: {
    width: '100%',
    fontSize: 12,
    fontStyle: 'bold',
    borderRightWidth: 1,
    textAlign: 'right',
    paddingLeft: 8,
  },
});

type TableFooterProp = {
  credits: number;
};
const TableFooter = ({ credits }: TableFooterProp) => {
  const rows = (
    <View>
      <Text style={styles.courseGrade}>Total Credits: {credits}</Text>
    </View>
  );
  return <Fragment>{rows}</Fragment>;
};
export default TableFooter;
