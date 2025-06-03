import React, { FC } from 'react';

import Modal, { ModalProps } from '@/components/Modal';
import UnfilledWarningIcon from '@/icons/UnfilledWarningIcon';

const ScreenSizeWarnModal: FC<ModalProps> = (props) => (
  <Modal {...props}>
    <div className="flex gap-4">
      <UnfilledWarningIcon className="h-10 w-10" stroke="#ffd900" />
      <span className="mt-1">
        Your screen size is not supported! You may continue at your own risk.
      </span>
    </div>
  </Modal>
);

export default ScreenSizeWarnModal;
