import React from 'react';

export interface DestinationData {
  name: string;
  destinationId: string;
}

/**
 * A hook used to manage a dialog that allows course selections.
 */
export function useSelectableCourseDialog(): SelectableCourseDialogReturnType {
  const [shouldShowDialog, setShouldShowDialog] = React.useState(false);
  const [destinationData, setDestinationData] = React.useState<DestinationData | null>(null);

  const showDialog = (destinationData: DestinationData) => {
    setShouldShowDialog(true);
    setDestinationData(destinationData);
  };

  const hideDialog = () => {
    setShouldShowDialog(false);
  };

  return {
    shouldShowDialog,
    destinationData,
    showDialog,
    hideDialog,
  };
}

type SelectableCourseDialogReturnType = {
  shouldShowDialog: boolean;
  destinationData: DestinationData | null;
  hideDialog: () => void;
  showDialog: (destinationData: DestinationData) => void;
};
