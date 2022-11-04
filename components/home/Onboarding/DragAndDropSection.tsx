import 'animate.css';

import { Grid } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

export default function DragAndDrop(): JSX.Element {
  return (
    <Grid sx={{}} container direction="column" alignItems="center" justifyContent="center">
      <img src="./demo.gif" />
      <Box width="98vw" height="300px"></Box>
    </Grid>
  );
}
