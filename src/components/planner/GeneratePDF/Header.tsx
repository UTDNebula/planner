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
    letterSpacing: 2,
    fontSize: 22,
    textAlign: 'left',
    textTransform: 'uppercase',
  },
  planMajor: {
    color: 'black',
    letterSpacing: 2,
    fontSize: 18,
    textAlign: 'left',
    paddingTop: 6,
  },
});

interface PlanHeaderProp {
  degreePlanTitle: string;
  major: string;
  studentName: string;
}

const PlanHeader = ({ studentName, major, degreePlanTitle }: PlanHeaderProp) => (
  <View style={styles.titleContainer}>
    <Text style={styles.planTitle}>{degreePlanTitle}</Text>
    <Text style={styles.planMajor}>{studentName}</Text>
    <Text style={styles.planMajor}>{major}</Text>
  </View>
);

export default PlanHeader;
