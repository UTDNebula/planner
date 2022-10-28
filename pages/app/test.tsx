import { PDFViewer } from '@react-pdf/renderer';

import UserDegreePlanPDF from '../../components/planner/GeneratePDF/GeneratePDF';

export default function Test() {
  return (
    <PDFViewer>
      <UserDegreePlanPDF />
    </PDFViewer>
  );
}
