import DeleteIcon from '@mui/icons-material/Delete';
import { FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { generateSemesters, Semester, SemesterCode } from '../../../modules/common/data';
import { RootState } from '../../../modules/redux/store';
import { deletePlan, updatePlan } from '../../../modules/redux/userDataSlice';

export type SettingsDialogProps = {
  planId: string;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  updatePlanTitle: (title: string) => void;
  updateSemesters: (semesters: Semester[]) => void;
};

/**
 * Renders a list of MenuItem options for the user to select in the dropdowns.
 *
 * @param array An array of any type where the indices are rendered as separate options
 * @return The rendered list of MenuItems
 */
function returnMenuItems<MenuItem>(menuOptions: string[]) {
  //TODO: Place in a utils file

  return menuOptions.map((option) => (
    <MenuItem key={option} value={option}>
      {option}
    </MenuItem>
  ));
}

/**
 * Component that allows the user to change their plan settings.
 * Currently in PlanningToolbar.tsx.
 */
export default function SettingsDialog({
  planId,
  isOpen,
  setOpen,
  updatePlanTitle,
  updateSemesters,
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
      setStartSemesterName(plan.semesters[0].title);
      setEndSemesterName(plan.semesters[plan.semesters.length - 1].title);
    }
  }, [plan]);

  const [title, setTitle] = React.useState('');
  const [major, setMajor] = React.useState('');
  // Update to current plan
  const [startSemesterName, setStartSemesterName] = useState('filler');
  const [endSemesterName, setEndSemesterName] = useState('fill');
  const [includeSummer, setIncludeSummer] = useState(false);

  const generatedSemesters: Semester[] = generateSemesters(
    60,
    new Date().getFullYear() - 10,
    SemesterCode.f,
    false,
    [],
    5,
    true,
  );

  const semesterNames = generatedSemesters.map((sem) => sem.title);

  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = () => {
    // Update title & major
    const newPlan = JSON.parse(JSON.stringify(plan));
    newPlan.major = major;
    newPlan.title = title;

    // Update semesters
    const startIdx = semesterNames.findIndex((val) => val === startSemesterName);
    const endIdx = semesterNames.findIndex((val) => val === endSemesterName);

    const newSem = [];
    let oldSem: Semester[] = newPlan.semesters;

    // TODO: Someone plz refactor this terrible code
    // Remove all summer if summer marked as not valid
    if (!includeSummer) {
      oldSem = oldSem.filter((sem, idx) => sem.code[sem.code.length - 1] !== 'u');
    }

    const oldSemMap: Record<string, Semester> = {};

    // Turn into hashmap
    for (let idx = 0; idx < oldSem.length; idx++) {
      oldSemMap[oldSem[idx].title] = oldSem[idx];
    }

    for (let i = startIdx; i <= endIdx; i++) {
      // Check if summer permitted
      if (
        generatedSemesters[i].code[generatedSemesters[i].code.length - 1] === 'u' &&
        !includeSummer
      ) {
        console.log('HI');
      } else {
        if (generatedSemesters[i].title in oldSemMap) {
          newSem.push(oldSemMap[generatedSemesters[i].title]);
        } else {
          newSem.push(generatedSemesters[i]);
        }
      }
    }

    newPlan.semesters = newSem;

    dispatch(updatePlan(newPlan));
    updateSemesters(newSem);
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
        <DialogContent className="grid grid-cols-2 gap-x-10 gap-y-6">
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
          <FormControl variant="outlined">
            <InputLabel id="demo-simple-select-autowidth-label">Starting Semester</InputLabel>

            <Select
              labelId="demo-simple-select-autowidth-label"
              name="classification"
              value={startSemesterName}
              onChange={(e) => setStartSemesterName(e.target.value)}
              id="demo-simple-select-autowidth"
              className="w-72"
              label="Starting Semester"
            >
              {returnMenuItems(semesterNames)}
            </Select>
          </FormControl>
          <FormControl variant="outlined">
            <InputLabel id="demo-simple-select-autowidth-label">Ending Semester</InputLabel>

            <Select
              labelId="demo-simple-select-autowidth-label"
              name="classification"
              value={endSemesterName}
              onChange={(e) => setEndSemesterName(e.target.value)}
              id="demo-simple-select-autowidth"
              className="w-72"
              label="Ending Semester"
            >
              {returnMenuItems(semesterNames)}
            </Select>
          </FormControl>
          <FormControlLabel
            control={<Switch />}
            checked={includeSummer}
            onChange={() => setIncludeSummer(!includeSummer)}
            label="Include summer semesters"
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
