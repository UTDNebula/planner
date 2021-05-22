import React from 'react';
// import { useHistory } from 'react-router-dom';

/**
 * A hook that manages expansion state and navigation for a UserPlanSheet.
 */
export default function useUserPlanSheetTransition(): UserPlanSheetTransitionData {
  const [sheetIsOpen, setSheetIsOpen] = React.useState(false);
  // const history = useHistory();

  const openPlan = (/* planId: string */) => {
    // TODO: Actually navigate to page
    // history.push(`/app/plan/${planId}`);
    setSheetIsOpen(true);
  };

  const closePlan = () => {
    setSheetIsOpen(false);
  };

  const togglePlan = () => {
    // This may look redundant, but trust me, you won't regret it.
    if (sheetIsOpen) {
      setSheetIsOpen(false);
    } else {
      setSheetIsOpen(true);
    }
  };

  return {
    sheetIsOpen,
    openPlan,
    closePlan,
    togglePlan,
  };
}

type UserPlanSheetTransitionData = {
  /**
   * True if the sheet is currently expanded, false otherwise.
   */
  sheetIsOpen: boolean;

  /**
   * Triggers a UserPlanSheet transition and navigates to the given plan.
   */
  openPlan: (planId: string) => void;

  /**
   * Closes the plan if it is currently open.
   */
  closePlan: () => void;

  /**
   * Opens the plan if it is currently closed and closes the plan if it is currently open.
   */
  togglePlan: () => void;
};
