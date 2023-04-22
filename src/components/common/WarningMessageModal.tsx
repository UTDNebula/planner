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
    <div className="fixed bottom-0 right-0 m-8 flex gap-2 rounded-md bg-yellow-400 transition-transform hover:scale-105">
      {expand ? (
        <div className="flex items-center justify-between gap-4 px-4 py-2">
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
