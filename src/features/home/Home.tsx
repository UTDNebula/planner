import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React, { useState } from 'react';
import AppToolbar from '../common/toolbar/AppToolbar';
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
  const [toolbarTitle, setToolbarTitle] = useState('Comet Planning');

  const classes = useStyles();

  return (
    <div>
      <AppToolbar shouldShowProfile={true} title={toolbarTitle}></AppToolbar>
      <div className={classes.root}>
        <HomePlanBlock />
        <HomeUserAnnouncementsBlock />
      </div>
    </div>
  );
}