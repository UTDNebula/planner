import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../../modules/redux/store';
import { deletePlan, updatePlan } from '../../../modules/redux/userDataSlice';

export type SettingsDialogProps = {
  planId: string;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  updatePlanTitle: (title: string) => void;
};

/**
 * Component that allows the user to change their plan settings.
 * Currently in PlanningToolbar.tsx.
 */
export default function SettingsDialog({
  planId,
  isOpen,
  setOpen,
  updatePlanTitle,
}: SettingsDialogProps) {
  const { plans } = useSelector((state: RootState) => state.userData);
  const plan = plans[planId];

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (plan !== undefined) {
      const { title, major } = plan;
      setTitle(title);
      setMajor(major);
      updatePlanTitle(title);
    }
  }, [plan]);

  const [title, setTitle] = React.useState('');
  const [major, setMajor] = React.useState('');
  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = () => {
    const newPlan = JSON.parse(JSON.stringify(plan));
    newPlan.major = major;
    newPlan.title = title;
    dispatch(updatePlan(newPlan));
    updatePlanTitle(title);
    setOpen(false);
  };

  // Open

  const handleAlertOpen = () => {
    setAlertOpen(true);
  };

  const handleDeletePlan = () => {
    dispatch(deletePlan(planId));
    handleAlertClose();
    router.push('/app');
  };

  const [alertOpen, setAlertOpen] = React.useState(false);
  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  return (
    <div>
      <Dialog maxWidth="xl" open={isOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Plan Settings</DialogTitle>
        <DialogContent className="grid grid-cols-2 gap-x-10">
          <DialogContentText className="col-span-2">
            Fill out the fields below to update your plan information.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Title"
            value={title}
            fullWidth
            onChange={(event) => setTitle(event.target.value)}
            inputProps={{ maxLength: 15 }}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Major"
            value={major}
            fullWidth
            onChange={(event) => setMajor(event.target.value)}
            inputProps={{ maxLength: 15 }}
          />
          <div className="col-span-2 flex justify-center items-center pt-2">
            <Button className="w-30" onClick={handleAlertOpen}>
              <DeleteIcon color="action" />
              Delete Plan
            </Button>
          </div>

          <Dialog
            open={alertOpen}
            onClose={handleAlertClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{'Delete Plan'}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this plan?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleAlertClose}>No</Button>
              <Button onClick={handleDeletePlan} autoFocus>
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
