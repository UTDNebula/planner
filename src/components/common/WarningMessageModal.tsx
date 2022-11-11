import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
import React from 'react';

export interface WarningMessageModalProps {
  setWarning: (open: boolean) => void;
  message: string;
}

export default function WarningMessageModal(props: WarningMessageModalProps) {
  const { setWarning, message } = props;
  const [expand, setExpand] = React.useState(false);

  return (
    <div className="bg-yellow-400 rounded-md fixed hover:scale-105 transition-transform bottom-0 right-0 flex gap-2 m-8">
      {expand ? (
        <div className="flex items-center justify-between gap-4 py-2 px-4">
          <div className="max-w-[200px]">{message}</div>
          <button onClick={() => setWarning(false)}>
            <CloseIcon />
          </button>
        </div>
      ) : (
        <button className="p-2" onClick={() => setExpand(true)}>
          <WarningIcon fontSize="medium" />
        </button>
      )}
    </div>
  );
}
