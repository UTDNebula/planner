import React from "react";

/**
 * The current state of new plan creation.
 */
export type NewPlanFlowState =
  | "SELECT_MAJOR"
  | "TRANSFER_COURSES"
  | "SELECT_ADDITIONS"
  | "DONE";

/**
 * A hook that keeps track of current state for a NewPlanDialog.
 *
 * @param startingState Where the dialog should start when shown to the user
 * @param shouldAdvance True if the next button is enabled at the current step
 */
export function useCreateNewPlanFlow(
  startingState: NewPlanFlowState = "SELECT_MAJOR",
  shouldAdvance: (currentState: NewPlanFlowState) => boolean = () => true
): CreateNewPlanFlowType {
  const [planState, setPlanState] = React.useState(startingState);
  const reset = () => {
    setPlanState("SELECT_MAJOR");
  };

  const inNewPlanFlow = planState !== "DONE";

  const goForward = () => {
    if (!shouldAdvance(planState)) {
      return;
    }
    switch (planState) {
      case "SELECT_MAJOR":
        // no-op: Can't go back further
        setPlanState("TRANSFER_COURSES");
        break;
      case "TRANSFER_COURSES":
        setPlanState("SELECT_ADDITIONS");
        break;
      case "SELECT_ADDITIONS":
        break;
    }
  };

  const goBack = () => {
    switch (planState) {
      case "SELECT_MAJOR":
        // no-op: Can't go back further
        break;
      case "TRANSFER_COURSES":
        setPlanState("SELECT_MAJOR");
        break;
      case "SELECT_ADDITIONS":
        setPlanState("TRANSFER_COURSES");
        break;
    }
  };

  return {
    planState,
    inNewPlanFlow,
    goForward,
    goBack,
    reset,
  };
}

type CreateNewPlanFlowType = {
  /**
   * The current step in the New Plan Flow
   */
  planState: NewPlanFlowState;

  /**
   * False if the plan is still being created; true otherwise.
   */
  inNewPlanFlow: boolean;

  /**
   * Advances the current step for the New Plan Flow.
   */
  goForward: () => void;

  /**
   * Steps back the current step for the New Plan Flow or no-op if already at start.
   */
  goBack: () => void;

  /**
   * Start the New Plan Flow from the beginning.
   */
  reset: () => void;
};
