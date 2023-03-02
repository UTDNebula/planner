import AddFileIcon from '@/icons/AddFileIcon';
import DownloadIcon from '@/icons/DownloadIcon';
import EditIcon from '@/icons/EditIcon';
import { FC } from 'react';
import Button from '../Button';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useSemestersContext } from './SemesterContext';
import SortByDropdown from './SortByDropdown';
import DegreePlanPDF from './DegreePlanPDF/DegreePlanPDF';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';

export interface ToolbarProps {
  title: string;
  major: string;
  studentName: string;
}

const Toolbar: FC<ToolbarProps> = ({ title, major, studentName }) => {
  const { allSemesters: semesters } = useSemestersContext();
  return (
    <section className="flex w-full flex-col justify-center gap-y-5">
      <article className="flex justify-between">
        <div className="flex items-center gap-2 text-primary-900">
          <button type="button" className="rounded-sm transition-all hover:bg-black/10">
            <Link href="/app/home">
              <ArrowBackIcon fontSize="medium" />
            </Link>
          </button>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        </div>
        <div className="flex h-min items-center gap-3">
          <SortByDropdown />
          <Button
            size="medium"
            data-tip="Import Plan"
            className="tooltip tooltip-bottom"
            icon={<AddFileIcon className="h-5 w-5" />}
          />
          <Button size="medium" icon={<DownloadIcon />}>
            <PDFDownloadLink
              document={
                <DegreePlanPDF studentName={studentName} planTitle={title} semesters={semesters} />
              }
            >
              <span className="whitespace-nowrap">Export Degree Plan</span>
            </PDFDownloadLink>
          </Button>
        </div>
      </article>

      <article className="flex justify-between pl-7">
        <button className="flex items-center gap-x-3 rounded-2xl bg-primary-100 py-2 px-3 tracking-tight">
          <span className="text-lg font-semibold text-primary-800">{major}</span>
          <EditIcon className="text-primary-800" />
        </button>
      </article>
    </section>
  );
};

export default Toolbar;
