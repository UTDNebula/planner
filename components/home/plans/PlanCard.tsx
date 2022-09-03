import router from 'next/router';
import { StudentPlan } from '../../../modules/common/data';

export type PlanCardProps = {
  id: string;
  plan: StudentPlan;
};

export default function PlanCard({ id, plan }: PlanCardProps) {
  const { title, major, semesters } = plan;
  const semesterCount = semesters.length;

  const handlePlanClick = () => {
    router.push(`/app/plans/${id}`);
  };
  return (
    <button
      onClick={handlePlanClick}
      className="w-60 h-40 m-10 flex p-4 border hover:bg-gray-100 border-gray-400 rounded-md flex-col shadow-xl"
    >
      <div className="text-headline6">{title}</div>
      <div className="text-subtitle2">Major: {major}</div>
      <div className="text-sm">{semesters.length} semesters</div>
    </button>
  );
}
