// import { Document, Page, StyleSheet, View } from '@react-pdf/renderer';
// import React from 'react';

// import { StudentPlan } from '../../../modules/common/data';
// import Header from './Header';
// import SemesterHeader from './SemesterHeader';
// import SemesterTable from './SemesterTable';

// const borderColor = '#3E61ED';
// // Create styles
// const styles = StyleSheet.create({
//   page: {
//     flexDirection: 'column',
//   },
//   section: {
//     margin: 10,
//     padding: 10,
//     flexGrow: 1,
//   },
// });

// type StudentPlanProp = {
//   name: string;
//   studentPlan: StudentPlan;
// };

// // Create Document Component containing the user's degree plan
// export default function UserDegreePlanPDF({ name, studentPlan }: StudentPlanProp) {
//   return (
//     <Document>
//       <Page size="A4" style={styles.page} wrap={false}>
//         <View style={styles.section}>
//           <Header name={name} degreePlan={studentPlan}></Header>
//           {studentPlan.semesters.map((semester) => (
//             <View key={semester.code} wrap={false}>
//               <SemesterHeader semester={semester}></SemesterHeader>
//               <SemesterTable
//                 items={semester.courses}
//                 semesterTitle={semester.title}
//               ></SemesterTable>
//             </View>
//           ))}
//         </View>
//       </Page>
//     </Document>
//   );
// }

export default function UserDegreePlanPDF() {
  return <div>Work in progress!</div>;
}
