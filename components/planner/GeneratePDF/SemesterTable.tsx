import { StyleSheet, View } from '@react-pdf/renderer';
import React from 'react';

import { Course } from '../../../modules/common/data';
import TableFooter from './TableFooter';
import TableHeader from './TableHeader';
import TableRow from './TableRow';

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#bff0fd',
  },
});

type TableProps = {
  items: Course[];
  semesterTitle: string;
};

export function calcCredits(items: Course[]) {
  let credits = 0;
  items.map((course) => (credits += course.creditHours));
  return credits;
}

const ItemsTable = ({ items }: TableProps) => (
  <View style={styles.tableContainer}>
    <TableHeader />
    {items.map((course) => (
      <TableRow item={course} key={undefined} />
    ))}
    <TableFooter credits={calcCredits(items)} />
  </View>
);

export default ItemsTable;
