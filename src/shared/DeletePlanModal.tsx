import { FC } from 'react';
import { createPortal } from 'react-dom';

import Modal, { ModalProps } from '@/components/Modal';

import Button from '../components/Button';

export interface DeleteModalProps extends ModalProps {
  deletePlan: () => void;
  deleteLoading: boolean;
}

const DeletePlanModal: FC<DeleteModalProps> = ({ deletePlan, deleteLoading, onClose, ...props }) =>
  createPortal(
    <Modal onClose={onClose} {...props}>
      <h1 className="text-lg font-medium">Delete plan</h1>
      <p className="mt-2 text-base text-neutral-400">
        {'Are you sure you want to delete? This action cannot be undone.'}
      </p>
      <div className="mt-4 flex h-full w-full flex-row gap-x-4">
        <div className="flex-grow"></div>
        <Button
          className="ml-autoc"
          color="tertiary"
          onClick={(e) => {
            onClose();
            e.stopPropagation();
          }}
        >
          Cancel
        </Button>
        <Button
          isLoading={deleteLoading}
          onClick={(e) => {
            e.stopPropagation();
            deletePlan();
          }}
        >
          Delete
        </Button>
      </div>
    </Modal>,
    document.body,
  );

export default DeletePlanModal;
