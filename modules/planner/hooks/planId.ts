import { useRouter } from 'next/router';

export type PLANNING_MODE = 'view' | 'plan';

/**
 * A hook to watch the current plan ID and planning mode.
 */
export function useObservePlanId(): ObservePlanIdReturnType {
  const router = useRouter();
  const { planId, mode } = router.query;

  const inPlanningMode = mode === 'plan';

  return {
    planId: planId ? planId[0] : '', // Should only be one planId in route
    inPlanningMode,
    mode: mode ? mode[0] : 'view', // Should only be one mode, ?mode=<PLANNING_MODE>
  };
}

type ObservePlanIdReturnType = {
  planId: string;
  inPlanningMode: boolean;
  mode: string;
};
