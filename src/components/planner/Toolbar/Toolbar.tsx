import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { usePDF } from '@react-pdf/renderer';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';

import AnalyticsWrapper from '@/components/common/AnalyticsWrapper';
import DownloadIcon from '@/icons/DownloadIcon';
import SettingsIcon from '@/icons/SettingsIcon';
import SwitchVerticalIcon from '@/icons/SwitchVerticalIcon';
import DeletePlanModal from '@/shared/DeletePlanModal';
import { trpc } from '@/utils/trpc';

import EditableMajorTitle from './EditablePlanTitle';
import EditSemestersModal from './EditSemestersModal';
import FilterByDropdown from './FilterByDropdown';
import SettingsDropdown from './SettingsDropdown';
import Button from '../../Button';
import DegreePlanPDF from '../DegreePlanPDF/DegreePlanPDF';
import EditableMajor from '../EditableMajor';
import { useSemestersContext } from '../SemesterContext';


export interface ToolbarProps {
  degreeRequirements: { id: string; major: string };
  planId: string;
  title: string;
  transferCredits: string[];
  studentName: string;
  deletePlan: () => void;
  deleteLoading: boolean;
}

const Toolbar: FC<ToolbarProps> = ({
  planId,
  title,
  degreeRequirements: { major, id: degreeRequirementsId },
  transferCredits,
  studentName,
  deletePlan,
  deleteLoading,
}) => {
  const { allSemesters: semesters } = useSemestersContext();
  const [editSemestersModalOpen, setEditSemestersModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const q = trpc.courses.publicGetAllCourses.useQuery(undefined, {
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const { data: coursesData } = q;

  const [{ loading, error, url }, update] = usePDF({
    document: (
      <DegreePlanPDF
        studentName={studentName}
        planTitle={title}
        major={major}
        semesters={semesters}
        transferCredits={transferCredits}
        coursesData={coursesData ?? []}
      />
    ),
  });

  useEffect(() => update(), [update, studentName, title, semesters, transferCredits, coursesData]);
  return (
    <div className="flex flex-row items-start gap-2 py-1 text-primary-900">
      <ToolbarWrapper>
        <button type="button" className="rounded-sm transition-all hover:bg-black/10">
          <Link href="/app/home">
            <ArrowBackIcon fontSize="medium" />
          </Link>
        </button>
      </ToolbarWrapper>
      <div id="tutorial-editor-4" className=" flex flex-col gap-y-[22px]">
        <ToolbarWrapper>
          <EditableMajorTitle initialTitle={title} planId={planId} />
        </ToolbarWrapper>
        <div className="-ml-1 h-fit w-80">
          <EditableMajor
            degreeRequirementsId={degreeRequirementsId}
            major={major}
            planId={planId}
          />
        </div>
      </div>
      <div className="grow"></div>
      <article className="flex flex-row gap-3">
        <ToolbarWrapper>
          <AnalyticsWrapper analyticsClass="umami--click--export-pdf">
            <a
              href={url || '#'}
              download={`${title} - ${new Date().toLocaleString().replaceAll('/', '_')}.pdf`}
            >
              <Button
                size="medium"
                isLoading={false}
                disabled={!!error}
                icon={<DownloadIcon />}
                id="tutorial-editor-7"
                className="whitespace-nowrap"
              >
                Export Degree Plan
              </Button>
            </a>
          </AnalyticsWrapper>
        </ToolbarWrapper>

        <ToolbarWrapper>
          <FilterByDropdown>
            <AnalyticsWrapper analyticsClass="umami--click--sort-by">
              <Button
                aria-label="Filter by options"
                size="medium"
                color="border"
                className="hover:bg-primary-100 hover:text-primary-900"
                id="tutorial-editor-6"
                icon={<SwitchVerticalIcon />}
              >
                <span className="whitespace-nowrap" id="world">
                  Sort By
                </span>
              </Button>
            </AnalyticsWrapper>
          </FilterByDropdown>
        </ToolbarWrapper>

        <ToolbarWrapper>
          <EditSemestersModal
            closeModal={() => setEditSemestersModalOpen(false)}
            planId={planId}
            startSemester={semesters[0].code}
            endSemester={semesters[semesters.length - 1].code}
            open={editSemestersModalOpen}
          />

          <DeletePlanModal
            open={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            deletePlan={deletePlan}
            deleteLoading={deleteLoading}
          />

          <SettingsDropdown
            openEditSemesterModal={() => setEditSemestersModalOpen(true)}
            openDeletePlanModal={() => setDeleteModalOpen(true)}
          >
            <SettingsIcon
              fill="var(--color-primary-900)"
              className="ml-8 mr-5 h-5 w-5 cursor-pointer"
              id="tutorial-editor-5"
            />
          </SettingsDropdown>
        </ToolbarWrapper>
      </article>
    </div>
  );
};

export default Toolbar;

const ToolbarWrapper: FC = ({ children }) => {
  return <div className="flex h-8 w-fit items-center justify-center">{children}</div>;
};
