import { useLocation, useParams } from 'react-router-dom';

export type PLANNING_MODE = 'view' | 'plan';

interface AppParams {
  planId: string;
}

/**
 * A custom hook that builds on useLocation to parse the query string.
 *
 * @see https://reactrouter.com/web/example/query-parameters
 */
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

/**
 * A hook to watch the current plan ID and planning mode.
 */
export function useObservePlanId() {
  const { planId } = useParams<AppParams>();
  const query = useQuery();
  const mode = query.get('mode');

  const inPlanningMode = mode === 'plan';

  return {
    planId,
    inPlanningMode,
    mode,
  };
}
