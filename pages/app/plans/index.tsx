import React from 'react';
import PlanCard from '../../../components/home/plans/PlanCard';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../modules/redux/store';
import { v4 as uuid } from 'uuid';
import { updatePlan } from '../../../modules/redux/userDataSlice';
import { initialPlan } from '../../../modules/planner/plannerUtils';

/**
 * A list of the user's plans
 */
export default function PlansPage(): JSX.Element {
  // const {} = useCreateNewPlanFlow();
  const [open, setOpen] = React.useState(false);

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
    <div className="flex flex-1 justify-center items-center bg-white">
      <section className="grid grid-cols-3 mx-40 my-20">
        <button
          onClick={handleCreatePlan}
          className="w-60 h-40 m-10 flex p-4 border justify-center items-center hover:bg-gray-100 border-gray-400 rounded-md shadow-xl"
        >
          <div className="flex flex-col justify-center items-center">
            <div className="text-3xl">
              <AddIcon fontSize="inherit" />
            </div>
            <div className="text-lg">Create Plan</div>
          </div>
        </button>
        {plans.map((plan) => (
          <PlanCard key={plan.id} id={plan.id} plan={plan} />
        ))}
      </section>
    </div>
  );
}
