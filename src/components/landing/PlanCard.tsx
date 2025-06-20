import router from 'next/router';
import React, { useState } from 'react';

import DotsHorizontalIcon from '@/icons/DotsHorizontalIcon';
import DeletePlanModal from '@/shared/DeletePlanModal';
import { trpc } from '@/utils/trpc';

import PlanCardDropdown from './PlanCardDropdown';

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
      setDeleting(false);
    },
  });

  const duplicatePlan = trpc.user.duplicateUserPlan.useMutation({
    async onSuccess() {
      await utils.plan.invalidate();
    },
  });

  const [deleting, setDeleting] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  return (
    <>
      <div className="relative w-full rounded-2xl border-b-12 border-[#A3A3A3] border-b-primary bg-white text-[#1C2A6D] transition-all hover:scale-110 hover:border-b-0 hover:bg-primary hover:text-white">
        <button
          onClick={handlePlanClick}
          className="flex h-[180px] w-full flex-col px-8 py-6 text-left cursor-pointer"
        >
          <div className="flex w-full flex-row items-center justify-between">
            <h4 className="overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-normal ">
              {major}
            </h4>
            <PlanCardDropdown
              deletePlan={() => setOpenDeleteModal(true)}
              duplicatePlan={() => duplicatePlan.mutateAsync({ id, major })}
            >
              <button
                aria-label="Customise options"
                className="h-10 w-10 self-stretch rounded-full hover:bg-neutral-200 hover:text-black cursor-pointer"
              >
                <DotsHorizontalIcon className="m-auto rotate-90" />
              </button>
            </PlanCardDropdown>
            <DeletePlanModal
              open={openDeleteModal}
              onClose={() => setOpenDeleteModal(false)}
              deletePlan={() => {
                setDeleting(true);
                deletePlan.mutateAsync(id);
              }}
              deleteLoading={deleting}
            />
          </div>
          <div className="flex grow items-center text-xl font-semibold">{name}</div>
        </button>
      </div>
    </>
  );
}
