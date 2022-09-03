import React from 'react';
import PlanCard from '../../../components/home/plans/PlanCard';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '../../../modules/redux/store';
import { v4 as uuid } from 'uuid';
import NewPlanDialog from '../../../components/planner/NewPlanDialog';
import { useCreateNewPlanFlow } from '../../../modules/planner/hooks/newPlanFlow';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, TextField } from '@mui/material';
import { maxWidth } from '@mui/system';
/**
 * A list of the user's plans
 */
export default function PlansPage(): JSX.Element {
  //const {} = useCreateNewPlanFlow();
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [major, setMajor] = React.useState('');
  const router = useRouter();

  // TODO: Write function to get user plans
  const { plans: userPlans } = useSelector((state: RootState) => state.userData);
  const plans = Object.values(userPlans);

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleCreatePlan = async () => {
    // Generate route id ${routeID}
    const routeID = uuid();
    console.log(router);
    router.push(`/app/plans/${routeID}`);
  };

  return (
    <div className="flex flex-1 justify-center items-center bg-white">
      <section className="grid grid-cols-3 mx-40 my-20">
        <button
          onClick={handleOpen}
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
      <NewPlanDialog openDialog={open} setOpenDialog={setOpen}></NewPlanDialog>
    </div>
  );
}
