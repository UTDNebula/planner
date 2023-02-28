import DotsHorizontalIcon from '@/icons/DotsHorizontalIcon';
import router from 'next/router';
import { trpc } from '@/utils/trpc';
import { useState } from 'react';
import DeleteModal from './DeleteModal';
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

  const [deleting, setDeleting] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  console.log({ openDeleteModal });
  return (
    <button
      onClick={handlePlanClick}
      className="flex h-[150px] w-full max-w-[300px] flex-col rounded-2xl bg-white py-6 px-8 text-left shadow-2xl transition-all hover:scale-110"
    >
      <div className="flex w-full flex-row items-center justify-between">
        <h4 className="overflow-hidden text-ellipsis whitespace-nowrap">{name}</h4>
        <PlanCardDropdown deletePlan={() => setOpenDeleteModal(true)}>
          <button aria-label="Customise options" className="self-stretch">
            <DotsHorizontalIcon className="m-auto rotate-90" />
          </button>
        </PlanCardDropdown>
        <DeleteModal
          open={openDeleteModal}
          onOpenChange={(open) => setOpenDeleteModal(open)}
          deletePlan={() => {
            setDeleting(true);
            deletePlan.mutateAsync(id);
          }}
          deleteLoading={deleting}
        />
      </div>

      <p>{major}</p>
    </button>
  );
}
