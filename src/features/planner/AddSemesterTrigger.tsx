import React from 'react';
import { Button, createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      padding: theme.spacing(1),
      textAlign: 'center',
      // maxHeight: 360,
      // // height: '100%',
      // flexDirection: 'column',
      // justifyContent: 'center',
      margin: '0 auto',
      minWidth: 240,
    },
    container: {
      display: 'block',
    },
    image: {
      height: 144,
      width: 144,
    },
    infoBox: {
      margin: theme.spacing(2),
    },
  }),
);

/**
 * Component properties for a {@link AddSemesterTrigger}
 */
interface AddSemesterTriggerProps {
  /**
   * Text that will be displayed beneath an image above the button.
   */
  infoText: string;

  /**
   * A callback triggered when a semester should be added.
   */
  onAddSemester: () => void;
}

/**
 * A button that is triggered when a semester should be added to a plan.
 */
export default function AddSemesterTrigger(props: AddSemesterTriggerProps) {
  const { infoText, onAddSemester } = props;
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.infoBox}>
          {/* TODO: Insert image */}
          <Typography variant="h6">{infoText}</Typography>
        </div>
        <Button
          variant="contained"
          color="secondary"
          onClick={onAddSemester}
          startIcon={<AddIcon />}
        >
          Add semester
        </Button>
      </div>
    </div>
  );
}
