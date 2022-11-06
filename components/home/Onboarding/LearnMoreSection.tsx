import 'animate.css';

import { Button, Grid, Typography } from '@mui/material';
import React from 'react';
import { Fade } from 'react-awesome-reveal';
import { useInView } from 'react-intersection-observer';

export default function NebFeatureDisplay(): JSX.Element {
  const { ref: learnMoreRef, inView: learnMoreVisible } = useInView({
    threshold: 0.75,
  });

  return (
    <div id="Learn More">
      <Grid
        sx={{ mt: -10, transform: 'translateY(-150px )' }}
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item>
          <Typography
            textAlign="center"
            variant="h1"
            color="black"
            fontSize="55px"
            fontWeight="500"
            letterSpacing="1px"
            paddingBottom="5px"
          >
            Learn More
          </Typography>
        </Grid>
        <Grid item>
          <Typography
            textAlign="center"
            variant="h5"
            color="black"
            letterSpacing="-0.5px"
            paddingBottom="50px"
          >
            Check out the other Project Nebula tools!
          </Typography>
        </Grid>
        <div ref={learnMoreRef}>
          {learnMoreVisible && (
            <div className="flex">
              <div>
                <Fade direction="down" triggerOnce={true}>
                  <Grid className="" item sx={{ pr: 5, mb: 3 }}>
                    <Button
                      //className="animate__animated animate_fadeIn animate_slower"
                      variant="contained"
                      sx={{ textTransform: 'none', width: '18vw' }}
                      style={{
                        background:
                          'linear-gradient(to right, rgba(150, 236, 197, 1), rgba(150, 236, 197, 0.3))',
                        borderRadius: '10px',
                      }}
                      href="https://github.com/UTDNebula/athena"
                    >
                      <Typography variant="h6" textAlign="center" fontWeight="bold" color="black">
                        Trends
                      </Typography>
                    </Button>
                  </Grid>
                </Fade>
                <Fade direction="left" triggerOnce={true}>
                  <Grid item>
                    <Button
                      variant="contained"
                      sx={{ textTransform: 'none', width: '18vw' }}
                      style={{
                        background:
                          'linear-gradient(to right, rgba(71, 87, 155, 0.7), rgba(69, 85, 153, 0.3))',
                        borderRadius: '10px',
                      }}
                      href="https://github.com/UTDNebula/nebula-api"
                    >
                      <Typography variant="h6" textAlign="center" fontWeight="bold" color="black">
                        Nebula API
                      </Typography>
                    </Button>
                  </Grid>
                </Fade>
              </div>
              <div>
                <Fade direction="right" triggerOnce={true}>
                  <Grid item sx={{ mb: 3 }}>
                    <Button
                      variant="contained"
                      sx={{ textTransform: 'none', width: '18vw' }}
                      style={{
                        background: 'linear-gradient(to right, #FBBB78, rgba(252, 210, 166, 0.3))',
                        borderRadius: '10px',
                      }}
                      href="https://github.com/UTDNebula/survival-guide"
                    >
                      <Typography variant="h6" textAlign="center" fontWeight="bold" color="black">
                        Guide
                      </Typography>
                    </Button>
                  </Grid>
                </Fade>
                <Fade direction="up" triggerOnce={true}>
                  <Grid item>
                    <Button
                      variant="contained"
                      sx={{ textTransform: 'none', width: '18vw' }}
                      style={{
                        background:
                          'linear-gradient(to right, rgba(209, 218, 254, 1), rgba(209, 218, 254, 0.3))',
                        borderRadius: '10px',
                      }}
                      href="https://dev.jupiter.utdnebula.com/"
                    >
                      <Typography variant="h6" textAlign="center" fontWeight="bold" color="black">
                        Jupiter
                      </Typography>
                    </Button>
                  </Grid>
                </Fade>
              </div>
            </div>
          )}
        </div>
      </Grid>
    </div>
  );
}
