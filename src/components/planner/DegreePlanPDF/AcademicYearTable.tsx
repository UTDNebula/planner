import { View, Text } from '@react-pdf/renderer';

import { getSemesterHourFromCourseCode } from '@/utils/utilFunctions';

export const DEFAULT_COURSE_CREDIT_HOUR = 3;

export default function AcademicYearTable({
  tableName,
  tableHeaders,
  tableData,
}: {
  tableName: string;
  tableHeaders: string[];
  tableData: (
    | null
    | number
    | {
        code: string;
        title: string;
      }
  )[][];
}) {
  let creditsSum = 0;

  tableData
    .flatMap((elm) => elm)
    .forEach((elm) => {
      if (typeof elm !== 'number' && elm !== null) {
        const creditHrs = getSemesterHourFromCourseCode(elm.code) ?? DEFAULT_COURSE_CREDIT_HOUR;
        creditsSum += creditHrs;
      }
    });
  return (
    <View
      wrap={false}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '10px',
      }}
    >
      {/* Table Name */}
      <Text
        style={{
          textAlign: 'center',
          fontSize: '12px',
          fontWeight: 'bold',
          backgroundColor: '#e0e7ff',
          padding: '4px',
        }}
      >
        {tableName}
      </Text>
      <AcademicTableHeaders elements={tableHeaders} />
      {tableData.map((row, idx) => (
        <AcademicTableRow key={idx} elements={row} />
      ))}
      <ShowCreditsRow creditsSum={creditsSum} />
    </View>
  );
}

const AcademicTableHeaders = ({ elements }: { elements: string[] }) => {
  return (
    <View
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        fontSize: '11px',
        fontWeight: 'bold',
      }}
    >
      <Text style={{ flex: 5, borderLeft: '1px solid #D4D4D4', padding: '4px' }}>
        {elements[0]}
      </Text>
      <Text
        style={{ flex: 1, borderLeft: '1px solid #D4D4D4', textAlign: 'center', padding: '4px' }}
      >
        {elements[1]}
      </Text>
      <Text style={{ flex: 5, borderLeft: '1px solid #D4D4D4', padding: '4px' }}>
        {elements[2]}
      </Text>
      <Text
        style={{ flex: 1, borderLeft: '1px solid #D4D4D4', textAlign: 'center', padding: '4px' }}
      >
        {elements[3]}
      </Text>{' '}
      <Text style={{ flex: 5, borderLeft: '1px solid #D4D4D4', padding: '4px' }}>
        {elements[4]}
      </Text>
      <Text
        style={{
          flex: 1,
          textAlign: 'center',
          borderLeft: '1px solid #D4D4D4',
          borderRight: '1px solid #D4D4D4',
          padding: '4px',
        }}
      >
        {elements[5]}
      </Text>
    </View>
  );
};

const AcademicTableRow = ({
  elements,
}: {
  elements: (
    | null
    | number
    | {
        code: string;
        title: string;
      }
  )[];
}) => {
  return (
    <View
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        fontSize: '9.5px',
        borderTop: '1px solid #D4D4D4',
      }}
    >
      <Text style={{ flex: 5, borderLeft: '1px solid #D4D4D4', padding: '4px' }}>
        <Text style={{ color: '#6466f1', fontWeight: 'semibold' }}>
          {typeof elements[0] === 'object' &&
            elements[0] !== null &&
            'code' in elements[0] &&
            elements[0].code}
        </Text>
        <Text> </Text>
        {typeof elements[0] === 'object' &&
          elements[0] !== null &&
          'title' in elements[0] &&
          elements[0].title}
      </Text>
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderLeft: '1px solid #D4D4D4',
          flex: 1,
          padding: '4px',
        }}
      >
        <Text style={{}}>{elements[1]}</Text>
      </View>
      <Text style={{ flex: 5, borderLeft: '1px solid #D4D4D4', padding: '4px' }}>
        <Text style={{ color: '#6466f1', fontWeight: 'semibold' }}>
          {typeof elements[2] === 'object' &&
            elements[2] !== null &&
            'code' in elements[2] &&
            elements[2].code}
        </Text>
        <Text> </Text>
        {typeof elements[2] === 'object' &&
          elements[2] !== null &&
          'title' in elements[2] &&
          elements[2].title}
      </Text>
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderLeft: '1px solid #D4D4D4',
          flex: 1,
          padding: '4px',
        }}
      >
        <Text style={{}}>{elements[3]}</Text>
      </View>
      <Text style={{ flex: 5, borderLeft: '1px solid #D4D4D4', padding: '4px' }}>
        <Text style={{ color: '#6466f1', fontWeight: 'semibold' }}>
          {typeof elements[4] === 'object' &&
            elements[4] !== null &&
            'code' in elements[4] &&
            elements[4].code}
        </Text>
        <Text> </Text>
        {typeof elements[4] === 'object' &&
          elements[4] !== null &&
          'title' in elements[4] &&
          elements[4].title}
      </Text>
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderLeft: '1px solid #D4D4D4',
          borderRight: '1px solid #D4D4D4',
          flex: 1,
          padding: '4px',
        }}
      >
        <Text style={{}}>{elements[5]}</Text>
      </View>
    </View>
  );
};

const ShowCreditsRow = ({ creditsSum }: { creditsSum: number }) => {
  return (
    <View
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        fontSize: '11px',
        fontWeight: 'semibold',
        backgroundColor: '#e0e7ff',
        padding: '4px',
      }}
    >
      <Text style={{ flex: 5 }}>Total Credits</Text>
      <Text
        style={{
          flex: 1,
          textAlign: 'center',
        }}
      ></Text>
      <Text style={{ flex: 5 }}></Text>
      <Text style={{ flex: 1, textAlign: 'center' }}></Text> <Text style={{ flex: 5 }}></Text>
      <Text
        style={{
          flex: 1,
          textAlign: 'center',
        }}
      >
        {creditsSum}
      </Text>
    </View>
  );
};
