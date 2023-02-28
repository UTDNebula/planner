import * as Dialog from '@radix-ui/react-dialog';
import { FC } from 'react';
import Button from '../Button';

export interface DeleteModalProps extends Dialog.DialogProps {
  deletePlan: () => void;
  deleteLoading: boolean;
}

const DeleteModal: FC<DeleteModalProps> = ({ deletePlan, deleteLoading, ...props }) => (
  <Dialog.Root {...props}>
    <Dialog.Portal>
      <Dialog.Trigger asChild>
        <button className="Button violet">Edit profile</button>
      </Dialog.Trigger>

      <Dialog.Overlay className="fixed inset-0 bg-generic-black bg-opacity-60" />
      <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-md bg-generic-white p-6">
        <Dialog.Title className="text-lg font-medium">Delete plan</Dialog.Title>
        <Dialog.Description className="mt-2 text-base text-neutral-400">
          {'Are you sure you want to delete? This action cannot be undone.'}
        </Dialog.Description>
        <div className="mt-4 flex gap-x-4">
          <Button
            className="ml-auto"
            isLoading={deleteLoading}
            onClick={(e) => {
              e.stopPropagation();
              deletePlan();
            }}
          >
            Delete
          </Button>
          <Dialog.Close asChild>
            <Button color="tertiary" onClick={(e) => e.stopPropagation()}>
              Cancel
            </Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default DeleteModal;
