import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    marginTop: 24,
  },
  planTitle: {
    color: '#61dafb',
    letterSpacing: 4,
    fontSize: 25,
    textAlign: 'left',
    textTransform: 'uppercase',
  },
});

type planHeaderProp = {
  title: string; // TODO: Title of the Plan
};

const PlanHeader = ({ title }: planHeaderProp) => (
  <View style={styles.titleContainer}>
    <Text style={styles.planTitle}>{title}</Text>
  </View>
);

export default PlanHeader;
