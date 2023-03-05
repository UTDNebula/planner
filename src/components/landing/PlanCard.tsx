import VerticalEllipsisIcon from '@/icons/VerticalEllipsisIcon';
import { trpc } from '@/utils/trpc';
import Tooltip from '@mui/material/Tooltip';
import { utils } from 'mocha';
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

  const utils = trpc.useContext();
  const deletePlan = trpc.plan.deletePlanById.useMutation({
    async onSuccess() {
      await utils.plan.invalidate();
    },
  });

  const duplicatePlan = trpc.user.duplicateUserPlan.useMutation({
    async onSuccess() {
      await utils.plan.invalidate();
    },
  });

  return (
    <>
      <div className="modal" id="my-modal-2">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Delete Plan</h3>
          <p className="py-4">Are you sure you would like to delete this plan?</p>
          <div className="modal-action">
            <a
              href="#"
              className="alert-error btn"
              onClick={() => {
                deletePlan.mutateAsync(id);
              }}
            >
              Yes
            </a>
            <a href="#" className="btn">
              No
            </a>
          </div>
        </div>
      </div>
      <button
        onClick={handlePlanClick}
        className="flex h-[150px] w-full max-w-[300px] flex-col rounded-2xl bg-white py-6 px-8 text-left shadow-2xl transition-all hover:scale-110"
      >
        <div className="flex w-full flex-row items-center justify-between">
          <h4 className="overflow-hidden text-ellipsis whitespace-nowrap">{name}</h4>
          <button
            className="dropdown h-fit w-fit"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className=" flex h-12 w-12 items-center justify-center rounded-full hover:bg-slate-100">
              <label tabIndex={0}>
                <VerticalEllipsisIcon />
              </label>

              <ul
                tabIndex={0}
                className="dropdown-content menu rounded-box w-36 bg-base-100 p-2 shadow"
              >
                <li>
                  <a
                    onClick={(e) => {
                      duplicatePlan.mutateAsync({ id, major });
                      e.stopPropagation();
                    }}
                  >
                    Duplicate Plan
                  </a>
                </li>
                <li>
                  <a
                    href="#my-modal-2"
                    className=""
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    Delete Plan
                  </a>
                </li>
              </ul>
            </div>
          </button>
        </div>

        <p>{major}</p>
      </button>
    </>
  );
}
