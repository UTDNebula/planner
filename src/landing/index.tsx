import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    background: '#E87500',
    border: 0,
    borderRadius: 3,
    color: 'white',
    height: 48,
    width: 210,
    margin: '10px',
    fontSize: '14px',
    fontWeight: 'bold',
    letterSpacing: '-0.25px',
    wordSpacing: '1px',
  },
  title: {
    marginTop: '8%',
    marginBottom: '25px',
    fontStyle: 'normal',
    fontSize: '60px',
    lineHeight: '60px',
    textAlign: 'center',
    letterSpacing: '-0.5px',
  },
  appBar: {
    top: 'auto',
    bottom: 0,
    background: '#F4F4F4',
    textAlign: 'right',
  },
  grow: {
    flexGrow: 1,
  },
  barText: {
    ...theme.typography.button,
    color: 'black',
    fontWeight: 'bold',
    padding: theme.spacing(1),
    letterSpacing: '0.25px',
    wordSpacing: '1.5px',
    // '&:hover': {
    //   backgroundColor: '#F4F4F4',
    // },
  },
  description: {
    fontSize: '16px',
    fontWeight: 500,
    lineHeight: '24px',
  },
}));

export default function LandingPage() {
  const classes = useStyles();
  return (
    <div className="App">
      <header>
        <h1 className={classes.title}>Comet Planning</h1>
        <p className={classes.description}>Plan out classes and more for your time at UTD</p>
        <div>
          <Button variant="contained" className={classes.root} disableElevation>
            START FROM SCRATCH
          </Button>
        </div>
        <div>
          <Button variant="contained" className={classes.root} disableElevation>
            START WITH CREDITS
          </Button>
        </div>
        <div>
          <Button variant="contained" className={classes.root} disableElevation>
            IMPORT EXISTING PLAN
          </Button>
        </div>
        <div>
          <Button variant="contained" className={classes.root} disableElevation>
            SIGN IN WITH ACCOUNT
          </Button>
        </div>
        {/* <p>Coming soon.</p> */}
        {/* <section>
          <h1>Testing stuff</h1>
          <div>
            <Link to="/schedules">See all test schedules</Link>
          </div>
        </section> */}
      </header>
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar>
          <div className={classes.grow} />
          <a
            className="App-link"
            href="https://github.com/acmutd/Development"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Typography className={classes.barText}>
              BUILT BY THE ASSOCIATION FOR COMPUTING MACHINERY AT UTD
            </Typography>
          </a>
        </Toolbar>
      </AppBar>
    </div>
  );
}
