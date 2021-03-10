import React from 'react';
import AppToolbar from '../features/common/toolbar/AppToolbar';
import { useCreateNewPlanFlow } from '../features/planner/hooks/newPlanFlow';
// import { useObservePlanId } from '../features/planner/hooks/planId';

/**
 * A list of the user's plans
 */
export default function PlansPage(): JSX.Element {
  const {} = useCreateNewPlanFlow();

  // const { planId } = useObservePlanId();

  return (
    <div>
      <AppToolbar title={'Your Plans'} shouldShowProfile={true} />
    </div>
  );
}
