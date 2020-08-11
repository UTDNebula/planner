import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  createStyles,
  Button,
  IconButton,
  Switch,
} from '@material-ui/core';
import AppsIcon from '@material-ui/icons/Apps';
import { Link } from 'react-router-dom';

/**
 * Component properties for a SchedulePlannerAppBar.
 */
interface SchedulePlannerAppBarProps {
  /**
   * The title of the current screen.
   */
  title: string;

  /**
   * A callback notified when the save button is pressed.
   */
  onTriggerSave: () => void;

  /**
   * A callback notified when a schedule's editability changes.
   */
  onToggleEdit: (shouldEdit: boolean) => void;
}

/**
 * Styles hook used for the SchedulePlannerAppBar.
 */
const useStyles = makeStyles((theme) => {
  return createStyles({
    title: {
      flexGrow: 1,
    },
    toggleLabel: {
      marginRight: theme.spacing(1),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
  });
});

/**
 * The app bar used for the SchedulePlanner.
 */
export default function SchedulePlannerAppBar(props: SchedulePlannerAppBarProps): JSX.Element {
  const classes = useStyles();
  const [inEditMode, setInEditMode] = React.useState(false);

  const handleEditToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const allowEditing = event.target.checked;
    setInEditMode(allowEditing);
    props.onToggleEdit(allowEditing);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="All Schedules"
          component={Link}
          to="/schedules"
        >
          <AppsIcon></AppsIcon>
        </IconButton>
        <Typography variant="h6" color="inherit" className={classes.title}>
          {props.title}
        </Typography>
        <Typography variant="subtitle1" color="inherit" className={classes.toggleLabel}>
          {inEditMode ? 'Editing schedule' : 'Viewing schedule'}
        </Typography>
        <Switch
          checked={inEditMode}
          onChange={handleEditToggle}
          name="editToggle"
          inputProps={{ 'aria-label': 'Toggle editing mode' }}
        />
        <Button onClick={props.onTriggerSave}>Save</Button>
      </Toolbar>
    </AppBar>
  );
}
