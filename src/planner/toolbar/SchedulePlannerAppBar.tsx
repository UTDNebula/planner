import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  createStyles,
  Button,
  IconButton,
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
}

/**
 * Styles hook used for the SchedulePlannerAppBar.
 */
const useStyles = makeStyles((theme) => {
  return createStyles({
    title: {
      flexGrow: 1,
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
        <Button onClick={props.onTriggerSave}>Save</Button>
      </Toolbar>
    </AppBar>
  );
}
