import AddIcon from '@mui/icons-material/Add';
import { trpc } from '@utils/trpc';
import React, { useState } from 'react';
import Button from '../Button';

import PlanCard from '../landing/PlanCard';
import TemplateModal from '../template/Modal';

/**
 * A list of the user's plans
 */
export default function PlansPage(): JSX.Element {
  const [openTemplateModal, setOpenTemplateModal] = useState(false);
  const userPlanQuery = trpc.plan.getUserPlans.useQuery();
  const { data } = userPlanQuery;
  if (!data) {
    return <div>You have not created any plans yet</div>;
  }

  return (
    <>
      <section className="flex h-full w-full flex-col gap-12 overflow-auto p-20">
        <h1 className="col-span-full">Home</h1>
        <Button
          color="primary"
          size="large"
          onClick={() => setOpenTemplateModal(true)}
          icon={<AddIcon fontSize="inherit" />}
        >
          New
        </Button>
        <div className="flex w-fit flex-wrap gap-8">
          {data.plans.map((plan) => (
            <PlanCard
              key={plan.id}
              id={plan.id}
              name={plan.name}
              major={plan.requirements?.major ?? 'undecided'}
            />
          ))}
        </div>
      </section>

      {openTemplateModal && <TemplateModal setOpenTemplateModal={setOpenTemplateModal} />}
    </>
  );
}
