import 'animate.css';

import { Button, Grid, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';

export default function NebPlannerDisplay(): JSX.Element {
  const router = useRouter();
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ height: '750px', marginTop: '-80px' }}
      sx={{ backgroundColor: 'white' }}
    >
      <div className="flex flex-col sm:flex-row place-items-center sm:place-items-auto gap-x-5">
        <div>
          <Grid item>
            <img
              src="/Nebula_Planner_Logo.png"
              alt="Nebula Planner Logo"
              style={{ width: '200px', height: '200px' }}
            />
          </Grid>
        </div>
        <div className="animate__animated animate__fadeInRight animate__slow">
          <Grid item>
            <Typography
              variant="h1"
              color="#4659A7"
              fontSize="40px"
              fontWeight="bold"
              letterSpacing="1px"
              paddingTop="15px"
            >
              Nebula Planner
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              variant="h6"
              color="black"
              fontWeight="bold"
              letterSpacing="0.5px"
              paddingTop="10px"
            >
              A degree planning tool
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              variant="h6"
              color="black"
              fontWeight="bold"
              letterSpacing="0.5px"
              paddingBottom="5px"
            >
              and so much more.
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              style={{
                borderRadius: '10px',
                backgroundColor: '#4659A7',

                fontSize: '15px',
              }}
              onClick={() => router.push('/auth/signup')}
            >
              GET STARTED
            </Button>
          </Grid>
        </div>
      </div>
    </Grid>
  );
}
