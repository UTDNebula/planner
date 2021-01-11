import React from 'react';
import { Course } from '../../../app/data';

export interface DestinationData {
  name: string;
  destinationId: string;
}

export function useSelectableCourseDialog() {
  const [shouldShowDialog, setShouldShowDialog] = React.useState(false);
  const [destinationData, setDestinationData] = React.useState<DestinationData | null>(null);

  const showDialog = () => {
    setShouldShowDialog(true);
  };

  const hideDialog = () => {
    setShouldShowDialog(false);
  };

  return {
    shouldShowDialog,
    destinationData,
    showDialog,
    hideDialog,
    setDestinationData,
  };
}
