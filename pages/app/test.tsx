import { PDFViewer } from '@react-pdf/renderer';

import MyDocument from '../../components/planner/GeneratePDF/GeneratePDF';

export default function Test() {
  return (
    <PDFViewer>
      <MyDocument />
    </PDFViewer>
  );
}
