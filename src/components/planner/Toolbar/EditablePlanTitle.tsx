import React from 'react';
import { toast } from 'react-toastify';

import PencilIcon from '@/icons/PencilIcon';
import { trpc } from '@/utils/trpc';

export default function EditableMajorTitle({
  initialTitle,
  planId,
}: {
  initialTitle: string;
  planId: string;
}) {
  const [title, setTitle] = React.useState(initialTitle);
  const [editTitle, setEditTitle] = React.useState(false);

  const updatePlanName = trpc.plan.updatePlanTitle.useMutation();

  const handleSaveTitle = () => {
    setEditTitle(false);
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
  };
  return (
    <>
      {!editTitle ? (
        <button
          className="flex flex-row items-center gap-x-3"
          id="tutorial-editor-4"
          onClick={() => {
            setEditTitle(true);
          }}
        >
          <span className="text-3xl font-semibold" data-testid="plan-title">
            {title}
          </span>
          <PencilIcon className="text-primary-800" />
        </button>
      ) : (
        <input
          data-testid="plan-title"
          className={`w-full border-2 border-[#F5F5F5] bg-inherit px-2 text-3xl font-semibold hover:ml-[1px] hover:border-[1px] hover:border-primary hover:py-[1px]`}
          value={title}
          autoFocus
          onChange={(event) => {
            const newTitle = event.target.value;

            setTitle(newTitle);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleSaveTitle();
            }
          }}
          onBlur={(_) => {
            handleSaveTitle();
          }}
        />
      )}
    </>
  );
}
