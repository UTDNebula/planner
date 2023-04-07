import { Font, StyleSheet, Text, View } from '@react-pdf/renderer';

Font.register({ family: 'Roboto', src: 'Inter var' });

const styles = StyleSheet.create({
  titleContainer: {},
  planTitle: {
    color: 'black',
    fontSize: 22,
    textAlign: 'center',
  },
  planMajor: {
    color: 'black',
    fontSize: 18,
    textAlign: 'center',
    paddingTop: 6,
  },
});

interface PlanHeaderProp {
  degreePlanTitle: string;
  studentName: string;
  major: string;
}

const PlanHeader = ({ studentName, degreePlanTitle, major }: PlanHeaderProp) => (
  <View
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: 20,
      marginBottom: '20px',
    }}
  >
    <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>{degreePlanTitle}</Text>
    <Text style={{ fontSize: '12px', fontWeight: 'semibold' }}>{studentName}</Text>
    <Text style={{ fontSize: '10px', fontWeight: 'light' }}>{major}</Text>
  </View>
);

export default PlanHeader;
