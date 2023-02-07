import AddIcon from '@mui/icons-material/Add';
import { trpc } from '@utils/trpc';
import React, { useState } from 'react';

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
        <button
          onClick={() => setOpenTemplateModal(true)}
          className="col-span-full flex h-12 w-32 flex-row items-center justify-center rounded-xl bg-[#3E61ED] p-2 text-white"
        >
          <div className="flex flex-row items-center">
            <div className="mr-2 flex flex-col items-center justify-center text-3xl">
              <AddIcon fontSize="inherit" />
            </div>
            <div className="mr-2 text-xl">New</div> {/* Hacky css to make it look centered */}
          </div>
        </button>
        <div className="flex w-fit flex-wrap gap-8">
          {data.plans.map((plan) => (
            <PlanCard key={plan.id} id={plan.id} name={plan.name} />
          ))}
        </div>
      </section>

      {openTemplateModal && <TemplateModal setOpenTemplateModal={setOpenTemplateModal} />}
    </>
  );
}
