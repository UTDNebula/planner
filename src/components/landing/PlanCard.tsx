import Tooltip from '@mui/material/Tooltip';
import router from 'next/router';

export type PlanCardProps = {
  id: string;
  name: string;
};

export default function PlanCard({ id, name }: PlanCardProps) {
  const handlePlanClick = () => {
    router.push(`/app/plans/${id}`);
  };

  return (
    <Tooltip
      title={name}
      componentsProps={{
        tooltip: {
          className: 'p-5 text-[16px] bg-white text-defaultText border-2  rounded-xl',
        },
      }}
      followCursor
      placement="top-start"
    >
      <button
        onClick={handlePlanClick}
        className="bg-white max-w-[300px] h-[150px] w-full text-left py-6 flex flex-col px-8 rounded-2xl shadow-2xl transition-all hover:scale-110"
      >
        <h4 className="max-w-full text-ellipsis whitespace-nowrap overflow-hidden">{name}</h4>
        <p>{name}</p>
      </button>
    </Tooltip>
  );
}
