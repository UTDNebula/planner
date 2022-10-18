import AddIcon from '@mui/icons-material/Add';
import { Theme } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';
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

  const useStyles = makeStyles()((theme: Theme) => {
    return {
      container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'start',
        paddingTop: '40px',
        height: '100%',
        width: '100%',
        background:
          'linear-gradient(105deg, rgba(245,167,94,0.01) 0%, rgba(255,200,136,0.05) 25%, rgba(222,174,170,0.1) 50%, rgba(135,143,214,0.1) 75%, rgba(98,226,168,0.1) 100%)',
      },
    };
  });

  const { classes } = useStyles();

  return (
    <main className={classes.container}>
      <section className="grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-16 gap-y-10">
        <h1 className="col-span-full">Plans</h1>
        <button
          onClick={handleCreatePlan}
          className="col-span-full text-white rounded-xl w-32 h-12 flex justify-center items-center flex-row bg-[#3E61ED]"
        >
          <div className="flex flex-row">
            <div className="text-3xl flex flex-col justify-center items-center mr-2">
              <AddIcon fontSize="inherit" />
            </div>
            <h4 className="mr-2">New</h4> {/* Hacky css to make it look centered */}
          </div>
        </button>
        {plans.map((plan) => (
          <PlanCard key={plan.id} id={plan.id} plan={plan} />
        ))}
      </section>
    </main>
  );
}
