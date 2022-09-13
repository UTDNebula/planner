import 'animate.css';

import { Button, Divider } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Fade } from 'react-awesome-reveal';
import { useInView } from 'react-intersection-observer';

// Purpose of this component is to display all semesters and course information from each respective semester.
export default function DegreePlanWrapper() {
  const { ref: featRef, inView: featVisible } = useInView({
    threshold: 0,
  });

  return (
    <>
      <Fade direction="left">
        <Card sx={{ background: '#4659A7', borderRadius: 2, width: '50vw' }}>
          <div ref={featRef}>
            {featVisible ? (
              <CardContent sx={{ width: { lg: 0.725 }, pl: 2 }}>
                <div
                  //className={`${animateType}`}
                  className="animate__animated animate__bounceInRight"
                >
                  {[1, 2, 3].map((elem, index) => (
                    <CardContent key={index}>
                      <Typography variant="h4" color="white" fontFamily="Jost" sx={{ mt: -2 }}>
                        Fall 2021
                      </Typography>
                      <Divider
                        sx={{ borderBottomWidth: 3, borderRadius: 2 }}
                        style={{ background: 'white' }}
                      />
                      <Typography
                        variant="h6"
                        color="white"
                        fontFamily="Jost"
                        style={{ float: 'right' }}
                      >
                        18 hours
                      </Typography>
                      <br></br>
                      <br></br>
                      <Button
                        sx={{ mt: -2, mr: 2.6, mb: 1, py: 0, px: 3 }}
                        variant="contained"
                        style={{
                          borderRadius: '10px',
                          backgroundColor: 'white',
                          color: 'black',
                          fontFamily: 'Jost',
                          fontWeight: 'bold',
                          fontSize: '15px',
                        }}
                      >
                        CS 1336
                      </Button>
                      <Button
                        sx={{ mt: -2, mr: 2.6, mb: 1, py: 0, px: 3 }}
                        variant="contained"
                        style={{
                          borderRadius: '10px',
                          backgroundColor: 'white',
                          color: 'black',
                          fontFamily: 'Jost',
                          fontWeight: 'bold',
                          fontSize: '15px',
                        }}
                      >
                        CS 1336
                      </Button>
                      <Button
                        sx={{ mt: -2, mr: 0, mb: 1, py: 0, px: 3 }}
                        variant="contained"
                        style={{
                          borderRadius: '10px',
                          backgroundColor: 'white',
                          color: 'black',
                          fontFamily: 'Jost',
                          fontWeight: 'bold',
                          fontSize: '15px',
                        }}
                      >
                        CS 1336
                      </Button>
                      <Button
                        sx={{ mr: 2.6, mb: 1, py: 0, px: 3 }}
                        variant="contained"
                        style={{
                          borderRadius: '10px',
                          backgroundColor: 'white',
                          color: 'black',
                          fontFamily: 'Jost',
                          fontWeight: 'bold',
                          fontSize: '15px',
                        }}
                      >
                        CS 1336
                      </Button>
                      <Button
                        sx={{ mr: 2.6, mb: 1, py: 0, px: 3 }}
                        variant="contained"
                        style={{
                          borderRadius: '10px',
                          backgroundColor: 'white',
                          color: 'black',
                          fontFamily: 'Jost',
                          fontWeight: 'bold',
                          fontSize: '15px',
                        }}
                      >
                        CS 1336
                      </Button>
                      <Button
                        sx={{ mr: 0, mb: 1, py: 0, px: 3 }}
                        variant="contained"
                        style={{
                          borderRadius: '10px',
                          backgroundColor: 'white',
                          color: 'black',
                          fontFamily: 'Jost',
                          fontWeight: 'bold',
                          fontSize: '15px',
                        }}
                      >
                        CS 1336
                      </Button>
                    </CardContent>
                  ))}
                </div>
              </CardContent>
            ) : (
              ''
            )}
          </div>
        </Card>
      </Fade>
    </>
  );
}
