import dynamic from 'next/dynamic';

import TemplateView from './TemplateView';

interface TemplateModalProps {
  setOpenTemplateModal: (flag: boolean) => void;
  page: 0 | 1;
}
export default function TemplateModal({ setOpenTemplateModal, page }: TemplateModalProps) {
  const CustomPlan = dynamic(() => import('@/components/template/CustomPlan'), { ssr: false });
  const modalScreens = [
    <CustomPlan key={0} onDismiss={() => setOpenTemplateModal(false)} />,
    <TemplateView key={1} onDismiss={() => setOpenTemplateModal(false)} />,
  ];
  return (
    <div
      onClick={() => setOpenTemplateModal(false)}
      className="absolute left-0 top-0 z-10 flex h-full w-full animate-fade items-center justify-center bg-black/50 transition-all"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative m-8 max-h-[90vh] w-full max-w-xl flex-col items-center justify-center gap-2 rounded-lg bg-white p-10 shadow-2xl"
      >
        {modalScreens[page]}
      </div>
    </div>
  );
}
