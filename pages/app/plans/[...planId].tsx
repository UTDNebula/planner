import classes from '*.module.css';
import { AppBar, Button, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import React from 'react';
import DegreePlannerChrome from '../../../components/planner/DegreePlannerChrome';

/**
 * A page that displays the details of a specific student academic plan.
 */
export default function PlanDetailPage(): JSX.Element {
  // TODO: Replace with custom styles

  const router = useRouter();
  const { planId: planQuery } = router.query;
  const planId = planQuery ? planQuery[0] : '';

  return (
    <div className="h-full">
      {/* TODO: Hoist toolbar and other UI up hierarchy */}
      <DegreePlannerChrome planId={planId} />
    </div>
  );
}
