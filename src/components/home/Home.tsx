import ChevronIcon from '@/icons/ChevronIcon';
import PlusIcon from '@/icons/PlusIcon';
import { trpc } from '@utils/trpc';
import { useState } from 'react';

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
      <section className="flex max-h-screen flex-grow flex-col gap-4 overflow-y-scroll p-16">
        <article className="flex flex-col">
          <div className="flex flex-row items-center justify-between">
            <div className="text-4xl">Course Dashboard</div>
            <button className="flex h-12 flex-row items-center gap-4 rounded-md bg-primary p-6 text-white ">
              <PlusIcon />
              <div className="">Add New Plan</div>
              <ChevronIcon className="rotate-90" />
            </button>
          </div>
          <div className="ml-1 text-lg text-[#737373]">Welcome Temoc!</div>
        </article>
        <article className=" grid h-fit w-fit grid-cols-3 gap-12">
          {data.plans.map((plan) => (
            <PlanCard
              key={plan.id}
              id={plan.id}
              name={plan.name}
              major={plan.requirements?.major ?? 'undecided'}
            />
          ))}
        </article>
      </section>
      {openTemplateModal && <TemplateModal setOpenTemplateModal={setOpenTemplateModal} />}
    </>
  );
}
