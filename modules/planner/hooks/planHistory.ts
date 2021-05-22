import React from 'react';

/**
 * An action that is done during planning.
 */
interface PlanningEvent {
  type: string;
  payload: Record<string, string>;
}

/**
 * A hook that provides a handle for modifications made to a StudentPlan during a planning session.
 */
export function usePlanHistory(): PlanHandle {
  const [stack, setStack] = React.useState<PlanningEvent[]>([]);

  const undo = () => {
    const updated = stack.slice(0, stack.length - 2);
    setStack(updated);
  };

  const push = (event: PlanningEvent) => {
    setStack(stack.concat([event]));
  };

  return {
    stack,
    push,
    undo,
  };
}

/**
 * Properties and functions to manipulate a StudentPlan history.
 */
type PlanHandle = {
  /**
   * A record of all events for a plan.
   */
  stack: PlanningEvent[];

  /**
   * Log a new planning event.
   */
  push: (event: PlanningEvent) => void;

  /**
   * Undo the last event.
   */
  undo: () => void;
};
