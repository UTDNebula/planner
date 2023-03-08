import Input from '@/components/Input';
import * as Dialog from '@radix-ui/react-dialog';
import { FC } from 'react';
import Button from '../../Button';

export interface EditSemestersModalProps extends Dialog.DialogProps {}

const EditSemestersModal: FC<EditSemestersModalProps> = ({ ...props }) => (
  <Dialog.Root {...props}>
    <Dialog.Portal>
      <Dialog.Trigger asChild>
        <button className="Button violet">Edit profile</button>
      </Dialog.Trigger>

      <Dialog.Overlay className="fixed inset-0 z-50 bg-generic-black bg-opacity-60" />
      <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 transform rounded-md bg-generic-white p-6">
        <Dialog.Title className="text-lg font-medium">Edit semesters</Dialog.Title>
        <Dialog.Description className="mt-2 text-base text-neutral-400">
          {'WARNING: This will add/delete semesters. This action cannot be undone.'}
        </Dialog.Description>
        <div className="mt-4 flex flex-col gap-y-3">
          <div className="inline-grid grid-cols-[125px_auto] items-center gap-1">
            <label htmlFor="start-semester" className="whitespace-nowrap">
              Start semester
            </label>
            <Input id="start-semester" value={2022} className="w-fit" />
          </div>
        </div>
        <div className="mt-2 inline-grid grid-cols-[125px_auto] items-center gap-1">
          <label htmlFor="end-semester" className="whitespace-nowrap">
            End semester
          </label>
          <Input id="end-semester" value={2026} className="w-fit" />
        </div>
        <div className="mt-4 ml-auto flex w-fit gap-x-4">
          <Dialog.Close asChild>
            <Button color="secondary" onClick={(e) => e.stopPropagation()}>
              Cancel
            </Button>
          </Dialog.Close>
          <Button
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            Save changes
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default EditSemestersModal;
