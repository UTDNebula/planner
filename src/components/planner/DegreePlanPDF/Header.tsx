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
}

const PlanHeader = ({ studentName, degreePlanTitle }: PlanHeaderProp) => (
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
  </View>
);

export default PlanHeader;
