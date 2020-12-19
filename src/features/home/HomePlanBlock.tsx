import { makeStyles, Theme, createStyles, Button, Typography } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
  },
  header: {},
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function HomePlanBlock() {
  const classes = useStyles();
  return (
    <section className={classes.root}>
      <header className={classes.header}>
        <Typography variant="h5">Your current plan</Typography>
      </header>
      <div>
        <div>
          <Typography variant="subtitle1">This semester</Typography>
          <div>
            <Button color="primary" component={Link} to="/plan">Start planning</Button>
          </div>
        </div>
        <div>
          <Typography variant="subtitle1">What's next</Typography>
        </div>
      </div>
    </section>
  );
}