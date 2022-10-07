import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';

import PlanCard from '../../components/home/plans/PlanCard';
import { initialPlan } from '../../modules/planner/plannerUtils';
import { RootState } from '../../modules/redux/store';
import { updatePlan } from '../../modules/redux/userDataSlice';

/**
 * A list of the user's plans
 */
export default function PlansPage(): JSX.Element {
  const router = useRouter();

  const dispatch = useDispatch();

  // TODO: Write function to get user plans
  const { plans: userPlans } = useSelector((state: RootState) => state.userData);
  const plans = Object.values(userPlans);

  const handleCreatePlan = async () => {
    // Generate route id
    const routeID = uuid();
    const newPlan = initialPlan;
    newPlan.id = routeID;
    dispatch(updatePlan(newPlan));
    router.push(`/app/plans/${routeID}`);
  };

  return (
    <div className="flex flex-col">
      <div className="text-black text-[40px] font-sans font-semibold ">Plans</div>
      <button
        onClick={handleCreatePlan}
        className="text-white w-32 h-12 flex justify-center items-center flex-row bg-[#3E61ED]"
      >
        <div className="flex flex-row">
          <div className="text-3xl flex flex-col justify-center items-center">
            <AddIcon fontSize="inherit" />
          </div>
          <div className="text-[20px] mr-2">New</div> {/* Hacky css to make it look centered */}
        </div>
      </button>
      <section className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 border-2 border-pink-500">
        {plans.map((plan) => (
          <PlanCard key={plan.id} id={plan.id} plan={plan} />
        ))}
      </section>
    </div>
  );
}
