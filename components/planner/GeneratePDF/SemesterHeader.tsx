import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

import { Semester } from '../../../modules/common/data';

const styles = StyleSheet.create({
  heading: {
    width: '100%',
    fontSize: 16,
    fontStyle: 'bold',
    textAlign: 'left',
    marginTop: 24,
    paddingLeft: 8,
  },
});

type SemesterTitleProp = {
  semester: Semester;
};

const SemesterHeader = ({ semester }: SemesterTitleProp) => (
  <View style={styles.heading}>
    <Text> {semester.title} </Text>
  </View>
);

export default SemesterHeader;
