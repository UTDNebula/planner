import router from 'next/router';

import { StudentPlan } from '../../../modules/common/data';

export type PlanCardProps = {
  id: string;
  plan: StudentPlan;
};

export default function PlanCard({ id, plan }: PlanCardProps) {
  const { title, major } = plan;

  const handlePlanClick = () => {
    router.push(`/app/plans/${id}`);
  };
  return (
    <button
      onClick={handlePlanClick}
      className="bg-white max-w-[300px] w-full text-left py-2 flex flex-col px-8 justify-center rounded-2xl shadow-2xl"
    >
      <h4>{title}</h4>
      <p>{major}</p>
    </button>
  );
}
