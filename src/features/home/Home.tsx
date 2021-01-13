import React from 'react';
import { Container, createStyles, makeStyles, Theme, Toolbar } from '@material-ui/core';
import HomePlanBlock from './HomePlanBlock';
import HomeUserAnnouncementsBlock from './HomeUserAnnouncementsBlock';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
      flexGrow: 1,
      padding: theme.spacing(2),
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    child: {},
  }),
);

export default function Home() {
  const classes = useStyles();

  return (
    <Container className={classes.root}>
      <Toolbar /> {/* TODO: Fix toolbar for spacing */}
      <HomeUserAnnouncementsBlock />
      <HomePlanBlock />
    </Container>
  );
}
