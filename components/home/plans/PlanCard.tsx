import router from 'next/router';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
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
      className=" text-white w-64 h-44 m-10 flex flex-col py-4 space-y-6 px-12 border bg-[#6372AE] hover:bg-blue-700 border-gray-400 rounded-md shadow-xl"
    >
      <div className="relative">
        <div className="text-headline6">{title}</div>
        <div className="absolute -right-10 -top-1 text-white">
          <IconButton
            color="inherit"
            onClick={(e) => {
              // TODO: Implement Me
              e.stopPropagation();
              console.log('Edit Icon clicked');
            }}
          >
            <EditIcon />
          </IconButton>
        </div>
      </div>
      <div className="bg-[#FBBB78] rounded-xl font-bold text-black p-0.5 text-center shadow-md">
        Sophomore
      </div>
      <div className="bg-white rounded-xl font-bold text-black p-0.5 text-center shadow-md">
        100/120 credits
      </div>
    </button>
  );
}
