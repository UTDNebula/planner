import { trpc } from '@/utils/trpc';
import React from 'react';
import { toast } from 'react-toastify';

export default function EditableMajorTitle({
  initialTitle,
  planId,
}: {
  initialTitle: string;
  planId: string;
}) {
  const [title, setTitle] = React.useState(initialTitle);

  const updatePlanName = trpc.plan.updatePlanTitle.useMutation();
  return (
    <input
      className={`w-72 border-2 border-[#F5F5F5] bg-inherit text-3xl font-semibold hover:ml-[1px] hover:border-[1px] hover:border-primary hover:py-[1px]`}
      value={title}
      onChange={(event) => {
        const newTitle = event.target.value;

        setTitle(newTitle);
      }}
      onBlur={(_) => {
        const newTitle = title.length > 0 ? title : 'untitled plan';
        if (initialTitle === newTitle) {
          return;
        }
        setTitle(newTitle);
        toast.promise(
          updatePlanName.mutateAsync({
            title: newTitle,
            planId,
          }),
          {
            pending: 'Updating plan title...',
            success: 'Plan title updated!',
            error: 'Error updating plan title',
          },
          {
            autoClose: 1000,
          },
        );
      }}
    />
  );
}
