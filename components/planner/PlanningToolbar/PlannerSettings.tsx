import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../modules/common/store';
import { updatePlan } from '../../../modules/profile/userDataSlice';

export type SettingsDialogProps = {
  planId: string;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  updatePlanTitle: (title: string) => void;
};
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
      //   updatePlanTitle(title);
    }
  }, [planId]);

  const [title, setTitle] = React.useState('');
  const [major, setMajor] = React.useState('');

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
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Major"
            value={major}
            fullWidth
            onChange={(event) => setMajor(event.target.value)}
          />
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
