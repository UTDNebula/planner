import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create({
  titleContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 20,
  },
  planTitle: {
    color: 'black',
    fontSize: 22,
    textAlign: 'left',
  },
  planMajor: {
    color: 'black',
    fontSize: 18,
    textAlign: 'left',
    paddingTop: 6,
  },
});

interface PlanHeaderProp {
  degreePlanTitle: string;
  studentName: string;
}

const PlanHeader = ({ studentName, degreePlanTitle }: PlanHeaderProp) => (
  <View style={styles.titleContainer}>
    <Text style={styles.planTitle}>{degreePlanTitle}</Text>
    <Text style={styles.planMajor}>{studentName}</Text>
  </View>
);

export default PlanHeader;
