import React from 'react';
import { AppBar, makeStyles, createStyles, Toolbar, Typography, Button } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = (elevated: boolean) =>
  makeStyles((theme) =>
    createStyles({
      root: {
        zIndex: elevated ? 0 : theme.zIndex.drawer + 1,
      },
      toolbarButton: {
        marginRight: theme.spacing(2),
      },
      title: {
        flexGrow: 1,
      },
    }),
  )();

/**
 * A toolbar with functionality specific to the LandingPage.
 */
export default function LandingToolbar(): JSX.Element {
  const shouldElevate = false;
  const classes = useStyles(shouldElevate);

  return (
    <AppBar position="static" className={classes.root} color="transparent" elevation={0}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}></Typography>
        <Button
          disabled
          className={classes.toolbarButton}
          color="primary"
          href="https://comet-data-service.web.app"
        >
          Admin
        </Button>
        <Button
          className={classes.toolbarButton}
          color="primary"
          variant="contained"
          component={RouterLink}
          to="/auth"
          disableElevation
          disabled
        >
          Sign in
        </Button>
      </Toolbar>
    </AppBar>
  );
}
