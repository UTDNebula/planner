import { Text, View } from '@react-pdf/renderer';

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
      marginBottom: '20px',
    }}
  >
    <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>{degreePlanTitle}</Text>
    <Text style={{ fontSize: '12px', fontWeight: 'semibold' }}>{studentName}</Text>
    <Text style={{ fontSize: '10px', fontWeight: 'light' }}>{major}</Text>
  </View>
);

export default PlanHeader;
