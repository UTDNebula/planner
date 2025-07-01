import React, { FC } from 'react';

export interface ModalProps {
  onClose: () => void;
  open: boolean;
  children?: React.ReactNode;
}

const Modal: FC<ModalProps> = ({ onClose, open, children }) =>
  open ? (
    <div
      onClick={onClose}
      className="fixed left-0 top-0 z-9999 flex h-full w-full animate-fade items-center justify-center bg-black/50 transition-all"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative m-8 max-h-[90vh] w-fit max-w-xl animate-[slideUpAndFade_0.3s] flex-col items-center justify-center gap-2 rounded-lg bg-white p-10 shadow-2xl"
      >
        {children}
      </div>
    </div>
  ) : null;

export default Modal;
