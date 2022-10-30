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
            fontWeight="bold"
            fontFamily="Jost"
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
            fontFamily="Jost"
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
                <Fade direction="down">
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
                      <Typography
                        variant="h6"
                        textAlign="center"
                        fontWeight="bold"
                        fontFamily="Jost"
                        color="black"
                      >
                        UTD Grades Upgrade
                      </Typography>
                    </Button>
                  </Grid>
                </Fade>
                <Fade direction="left">
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
                      <Typography
                        variant="h6"
                        textAlign="center"
                        fontWeight="bold"
                        fontFamily="Jost"
                        color="black"
                      >
                        Nebula API
                      </Typography>
                    </Button>
                  </Grid>
                </Fade>
              </div>
              <div>
                <Fade direction="right">
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
                      <Typography
                        variant="h6"
                        textAlign="center"
                        fontWeight="bold"
                        fontFamily="Jost"
                        color="black"
                      >
                        UTD Survival Guide
                      </Typography>
                    </Button>
                  </Grid>
                </Fade>
                <Fade direction="up">
                  <Grid item>
                    <Button
                      variant="contained"
                      sx={{ textTransform: 'none', width: '18vw' }}
                      style={{
                        background:
                          'linear-gradient(to right, rgba(209, 218, 254, 1), rgba(209, 218, 254, 0.3))',
                        borderRadius: '10px',
                      }}
                      href="https://about.utdnebula.com/"
                    >
                      <Typography
                        variant="h6"
                        textAlign="center"
                        fontWeight="bold"
                        fontFamily="Jost"
                        color="black"
                      >
                        About Nebula
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
