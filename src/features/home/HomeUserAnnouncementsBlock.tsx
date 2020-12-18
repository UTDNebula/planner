import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme: Theme) => createStyles({

}));

export default function HomeUserAnnouncementsBlock() {
  return (
    <section>
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
