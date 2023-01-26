import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create({
  heading: {
    width: '100%',
    fontSize: 16,
    fontStyle: 'bold',
    textAlign: 'left',
    marginTop: 24,
  },
});

const SemesterHeader = ({ title }: { title: string }) => (
  <View style={styles.heading}>
    <Text> {title} </Text>
  </View>
);

export default SemesterHeader;
