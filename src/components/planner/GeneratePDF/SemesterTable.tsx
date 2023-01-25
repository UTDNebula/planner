// import { StyleSheet, View } from '@react-pdf/renderer';
// import React from 'react';

// import { Course } from '../../../modules/common/data';
// import TableFooter from './TableFooter';
// import TableHeader from './TableHeader';
// import TableRow from './TableRow';

// const styles = StyleSheet.create({
//   tableContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: '#3E61ED',
//   },
// });

// type TableProps = {
//   items: Course[];
//   semesterTitle: string;
// };

// const ItemsTable = ({ items }: TableProps) => {
//   let totalHours = 0;
//   return (
//     <View style={styles.tableContainer}>
//       <TableHeader />
//       {items.map((course) => {
//         totalHours += course.creditHours;
//         return <TableRow item={course} key={undefined} />;
//       })}
//       <TableFooter credits={totalHours} />
//     </View>
//   );
// };

// export default ItemsTable;
export default function UserDegreePlanPDF() {
  return <div>Work in progress!</div>;
}
