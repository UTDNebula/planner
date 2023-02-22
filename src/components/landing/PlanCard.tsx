import Tooltip from '@mui/material/Tooltip';
import router from 'next/router';

export type PlanCardProps = {
  id: string;
  name: string;
  major: string;
};

export default function PlanCard({ id, name, major }: PlanCardProps) {
  const handlePlanClick = () => {
    router.push(`/app/plans/${id}`);
  };

  return (
    <Tooltip
      title={name}
      componentsProps={{
        tooltip: {
          className: 'p-5 text-[16px] bg-white text-primary-900 border-2  rounded-xl',
        },
      }}
      followCursor
      placement="top-start"
    >
      <button
        onClick={handlePlanClick}
        className="flex h-[150px] w-full max-w-[300px] flex-col rounded-2xl bg-white py-6 px-8 text-left shadow-2xl transition-all hover:scale-110"
      >
        <h4 className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">{name}</h4>
        <p>{major}</p>
      </button>
    </Tooltip>
  );
}
