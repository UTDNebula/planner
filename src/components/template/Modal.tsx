import CloseIcon from '@mui/icons-material/Close';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import ChoosePlanType from './ChoosePlanType';
import TemplateView from './TemplateView';

interface TemplateModalProps {
  setOpenTemplateModal: (flag: boolean) => void;
}
export default function TemplateModal({ setOpenTemplateModal }: TemplateModalProps) {
  const [page, setPage] = useState(0);

  const CustomPlan = dynamic(() => import('@/components/template/CustomPlan'), { ssr: false });
  const modalScreens = [
    <ChoosePlanType key={0} setPage={setPage} />,
    <CustomPlan key={1} setPage={setPage} />,
    <TemplateView key={2} setPage={setPage} />,
  ];
  return (
    <div
      onClick={() => setOpenTemplateModal(false)}
      className="absolute left-0 top-0 z-10  flex h-full w-full items-center justify-center backdrop-blur-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative m-8 max-h-[90vh] w-full max-w-4xl flex-col items-center justify-center gap-2  rounded-lg bg-white p-10"
      >
        {modalScreens[page]}
        <button
          onClick={() => setOpenTemplateModal(false)}
          className="absolute top-0 right-0 m-2 rounded-lg border-2 border-black transition-colors hover:bg-slate-700 hover:text-white"
        >
          <CloseIcon fontSize="medium" />
        </button>
      </div>
    </div>
  );
}
