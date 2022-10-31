import 'animate.css';

import { Grid } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

export default function DragAndDrop(): JSX.Element {
  return (
    <Grid sx={{}} container direction="column" alignItems="center" justifyContent="center">
      <video
        className="w-full h-screen object-cover object-left-top"
        id="background-video"
        autoPlay
        loop
        muted
        poster="https://assets.codepen.io/6093409/river.jpg"
      >
        <source src="./recording.mp4" type="video/mp4" />
      </video>
      <Box width="98vw" height="300px"></Box>
    </Grid>
  );
}
