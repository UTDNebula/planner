import VerticalEllipsisIcon from '@/icons/VerticalEllipsisIcon';
import { trpc } from '@/utils/trpc';
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
    <>
      {<PlanCardModal id={id} />}
      <div className="relative w-full rounded-2xl border-b-[12px] border-[#A3A3A3] border-b-primary bg-white text-[#1C2A6D] transition-all hover:scale-110 hover:border-b-[0px] hover:bg-primary hover:text-white">
        <button
          onClick={handlePlanClick}
          className="flex h-[180px] w-full flex-col py-6 px-8 text-left"
        >
          <div className="flex w-full flex-row items-center justify-between">
            <h4 className="overflow-hidden text-ellipsis whitespace-nowrap">{name}</h4>
            <button
              className="dropdown h-fit w-fit"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className=" flex h-12 w-12 items-center justify-center rounded-full hover:bg-slate-700">
                <label tabIndex={0}>
                  <VerticalEllipsisIcon className="" />
                </label>

                <ul
                  tabIndex={0}
                  className="dropdown-content menu rounded-box w-36 bg-base-100 p-2 shadow"
                >
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
          <div className="flex flex-grow items-center text-xl font-semibold">{major}</div>
        </button>
      </div>
    </>
  );
}

const PlanCardModal = ({ id }: { id: string }) => {
  const utils = trpc.useContext();
  const deletePlan = trpc.plan.deletePlanById.useMutation({
    async onSuccess() {
      await utils.plan.invalidate();
    },
  });

  return (
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
  );
};
