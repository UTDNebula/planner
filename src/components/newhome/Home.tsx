import AddIcon from '@mui/icons-material/Add';
import { trpc } from '@utils/trpc';
import React, { useState } from 'react';

import PlanCard from '../home/plans/PlanCard';
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
      <section className="flex flex-col w-full h-full p-20 gap-12 overflow-auto">
        <h1 className="col-span-full">Home</h1>
        <button
          onClick={() => setOpenTemplateModal(true)}
          className="col-span-full text-white rounded-xl w-32 h-12 p-2 flex justify-center items-center flex-row bg-[#3E61ED]"
        >
          <div className="flex flex-row items-center">
            <div className="text-3xl flex flex-col justify-center items-center mr-2">
              <AddIcon fontSize="inherit" />
            </div>
            <div className="mr-2 text-xl">New</div> {/* Hacky css to make it look centered */}
          </div>
        </button>
        <div className="w-fit flex flex-wrap gap-8">
          {data.plans.map((plan) => (
            <PlanCard key={plan.id} id={plan.id} name={plan.name} />
          ))}
        </div>
      </section>

      {openTemplateModal && <TemplateModal setOpenTemplateModal={setOpenTemplateModal} />}
    </>
  );
}
