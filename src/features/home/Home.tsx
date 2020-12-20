import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import HomePlanBlock from './HomePlanBlock';
import HomeUserAnnouncementsBlock from './HomeUserAnnouncementsBlock';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function Home() {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.root}>
        <HomeUserAnnouncementsBlock />
        <HomePlanBlock />
      </div>
    </div>
  );
}