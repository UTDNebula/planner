import React from 'react';
import NewPlanDialog from '../../../components/planner/NewPlanDialog';

/**
 * A list of the user's plans
 */
export default function PlansPage(): JSX.Element {
  // const {} = useCreateNewPlanFlow();
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <button onClick={() => setOpen(true)}>Create New Plan </button>
      <NewPlanDialog openDialog={open} setOpenDialog={setOpen} />
    </div>
  );
}
