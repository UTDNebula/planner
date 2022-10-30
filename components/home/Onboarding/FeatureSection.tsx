import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

import DegreePlanWrapper from './ClassCard';

interface FeatureProps {
  ref2: any;
}

export default function NebFeatureDisplay({ ref2 }: FeatureProps): JSX.Element {
  return (
    <div
      ref={ref2}
      className="h-screen"
      style={{
        background: 'linear-gradient(#f5a75e, #ffffff)',
        transform: 'translateY(-15%)',
        // transform: "translateY(-300px)",
        scrollBehavior: 'smooth',
      }}
      id="Features"
    >
      <div
        style={{
          width: '100%',
          height: '20vh',
          borderTopRightRadius: '0',
          borderTopLeftRadius: '0',
          borderBottomRightRadius: '100%',
          borderBottomLeftRadius: '5%',
          background: 'white',
        }}
      ></div>
      <div className="flex flex-col-2">
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ height: '70vh' }}
        >
          <Box>
            <Grid item>
              <Typography
                textAlign="left"
                variant="h1"
                color="black"
                fontSize="55px"
                fontWeight="bold"
                fontFamily="Jost"
                letterSpacing="1px"
                paddingBottom="20px"
              >
                Features
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                textAlign="left"
                variant="h6"
                color="black"
                fontWeight="bold"
                fontFamily="Jost"
                letterSpacing="0.5px"
                paddingTop="10px"
              >
                Add your existing and
              </Typography>
              <Typography
                variant="h6"
                color="black"
                fontWeight="bold"
                fontFamily="Jost"
                letterSpacing="0.5px"
                paddingBottom="20px"
              >
                transfer credits.
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="h6"
                color="black"
                fontWeight="bold"
                fontFamily="Jost"
                letterSpacing="0.5px"
              >
                Build personalized degree
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="h6"
                color="black"
                fontWeight="bold"
                fontFamily="Jost"
                letterSpacing="0.5px"
                paddingBottom="20px"
              >
                plans.
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="h6"
                color="black"
                fontWeight="bold"
                fontFamily="Jost"
                letterSpacing="0.5px"
              >
                Pin your favorite plan.
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="h6"
                color="black"
                fontWeight="bold"
                fontFamily="Jost"
                letterSpacing="0.5px"
                paddingTop="20px"
              >
                See your progress.
              </Typography>
            </Grid>
          </Box>
        </Grid>
        <Grid
          sx={{ mt: 2, ml: -20, display: { xs: 'none', lg: 'block' } }}
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <DegreePlanWrapper />
        </Grid>
      </div>
      <div
        style={{
          width: '100%',
          height: '10vh',
          borderTopRightRadius: '10%',
          borderTopLeftRadius: '100%',
          borderBottomRightRadius: '0%',
          borderBottomLeftRadius: '0%',
          background: 'white',
        }}
      ></div>
    </div>
  );
}
