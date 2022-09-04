import React from 'react';
import PlanCard from '../../../components/home/plans/PlanCard';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '../../../modules/redux/store';
import { v4 as uuid } from 'uuid';

/**
 * A list of the user's plans
 */
export default function PlansPage(): JSX.Element {
  // const {} = useCreateNewPlanFlow();
  const [open, setOpen] = React.useState(false);

  const router = useRouter();

  // TODO: Write function to get user plans
  const { plans: userPlans } = useSelector((state: RootState) => state.userData);
  const plans = Object.values(userPlans);

  const handleCreatePlan = async () => {
    // Generate route id
    const routeID = uuid();
    router.push(`/app/plans/${routeID}`);
  };

  return (
    <div className="flex flex-col mx-4 my-12">
      <div className="text-white text-3xl ml-10">Degree Plans </div>
      <section className="grid grid-cols-3">
        <button
          onClick={handleCreatePlan}
          className="text-white justify-center items-center space-y-4 w-64 h-44 m-10 flex p-4 border bg-[#6372AE] hover:bg-blue-700 border-gray-400 rounded-md flex-col shadow-xl"
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
