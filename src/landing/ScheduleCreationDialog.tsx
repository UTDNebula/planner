import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@material-ui/core';

interface ScheduleCreationDialogProps {
  scheduleName?: string;
  visible: boolean;
  onScheduleCreated: (name: string) => void;
  onDismiss: () => void;
}

// TODO: Integrate this into onboarding dialog
function ScheduleCreationDialog(props: ScheduleCreationDialogProps): JSX.Element {
  const initialScheduleName = props.scheduleName ?? '';
  const { visible, onScheduleCreated, onDismiss } = props;
  const [scheduleName, setScheduleName] = React.useState(initialScheduleName);

  const handleUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const contents = event.target.value;
    setScheduleName(contents);
  };

  return (
    <Dialog open={visible} onClose={onDismiss} maxWidth="sm" fullWidth>
      <DialogTitle id="form-dialog-title">New Schedule</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Schedule name"
          type="text"
          fullWidth
          value={scheduleName}
          onChange={handleUpdate}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onDismiss} color="primary">
          Cancel
        </Button>
        <Button onClick={() => onScheduleCreated(scheduleName)} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ScheduleCreationDialog;
