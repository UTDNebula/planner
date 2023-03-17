import { Text, View } from '@react-pdf/renderer';
import React from 'react';

const SemesterHeader = ({ title }: { title: string }) => (
  <View style={{ width: '100%', fontSize: 12, fontStyle: 'bold', textAlign: 'center' }}>
    <Text> {title} </Text>
  </View>
);

export default SemesterHeader;
