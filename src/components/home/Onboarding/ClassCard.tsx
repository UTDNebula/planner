import 'animate.css';

import { Button, Divider } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Fade } from 'react-awesome-reveal';

// Purpose of this component is to display all semesters and course information from each respective semester.
export default function DegreePlanWrapper() {
  return (
    <Fade direction="left" triggerOnce={true}>
      <Card sx={{ background: '#4659A7', borderRadius: 2, width: '50vw' }}>
        <CardContent sx={{ width: { lg: 0.725 }, pl: 2 }}>
          <div
          //className={`${animateType}`}
          >
            {[1, 2, 3].map((elem, index) => (
              <CardContent key={index}>
                <Typography variant="h4" color="white" sx={{ mt: -2 }}>
                  Fall 2021
                </Typography>
                <Divider
                  sx={{ borderBottomWidth: 3, borderRadius: 2 }}
                  style={{ background: 'white' }}
                />
                <Typography variant="h6" color="white" style={{ float: 'right' }}>
                  18 hours
                </Typography>
                <br></br>
                <br></br>
                <div className="gap-x-2">
                  {[1, 2, 3, 4, 5, 6].map((index) => (
                    <Button
                      key={index}
                      sx={{ py: 0, px: 3, mx: 1, my: 1 }}
                      variant="contained"
                      style={{
                        borderRadius: '10px',
                        backgroundColor: 'white',
                        color: 'black',

                        fontWeight: 'bold',
                        fontSize: '15px',
                      }}
                    >
                      CS 1336
                    </Button>
                  ))}
                </div>
              </CardContent>
            ))}
          </div>
        </CardContent>
      </Card>
    </Fade>
  );
}
