import Head from 'next/head';
import React from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { Button, Card, CardContent, CardMedia, Grid, IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import 'animate.css';
import { useInView } from 'react-intersection-observer';

export default function DragAndDrop(): JSX.Element {
  return (
    <Grid sx={{ mt: -9 }} container direction="column" alignItems="center" justifyContent="center">
      <Grid item>
        <Typography
          variant="h1"
          color="black"
          fontSize="55px"
          fontWeight="bold"
          fontFamily="Jost"
          letterSpacing="1px"
          paddingBottom="20px"
          textAlign="center"
        >
          Drag and Drop in Action
        </Typography>
      </Grid>
      <CardMedia
        className="animate__animated animate__flipInX animate_slower"
        width="100vw"
        style={{ height: '60vh' }}
        component="iframe"
        src="https://www.youtube.com/embed/bxqLsrlakK8"
      ></CardMedia>
      <Box width="98vw" height="300px"></Box>
    </Grid>
  );
}