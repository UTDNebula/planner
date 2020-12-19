import { colors, createStyles, makeStyles, Theme } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    background: colors.grey[200],
  },
}));

export default function HomeUserAnnouncementsBlock() {
  const classes = useStyles();

  return (
    <section className={classes.root}>
      <header>
        Your current plan
      </header>
      <div>
        <div>
          This semester
        </div>
        <div>
          What's next
        </div>
      </div>
    </section>
  );
}
