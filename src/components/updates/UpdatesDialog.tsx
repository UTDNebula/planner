import React from 'react';
import { useUpdateService } from '../../features/updates/updateService';

/**
 * A dialog shown to the user when there is an update to the app.
 */
export default function UpdatesDialog(): JSX.Element {
  const { newestUpdate, performUpdate } = useUpdateService();

  const triggerUpdate = () => {
    // TODO: Close dialog
    performUpdate();
  };

  return (
    <div>
      <div className="p-4">
        <div>New update!</div>
        <div className="text-headline-6 font-bold">{newestUpdate.title}</div>
      </div>
      <div className="p-4">
        <div>Changelog</div>
        <div className="text-body1">{newestUpdate.changelog}</div>
      </div>
      <div className="p-4">
        <button onClick={triggerUpdate}>Update now</button>
      </div>
    </div>
  );
}
