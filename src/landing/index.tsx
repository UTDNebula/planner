import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { useTheme } from 'styled-components';
import { useAuth0 } from "@auth0/auth0-react";
import './index.css';

const useStyles = makeStyles((theme) => ({
  page: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  root: {
    height: '100vh',
  },
  title: {
    marginBottom: '25px',
    fontStyle: 'normal',
    fontSize: '64px',
    lineHeight: '64px',
    textAlign: 'center',
    letterSpacing: '-0.5px',
  },
  contentContainer: {
    flexGrow: 1,
    margin: 'auto',
    maxWidth: 768,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  header: {
    textAlign: 'center',
  },
  footer: {
    top: 'auto',
    bottom: 0,
    background: '#F4F4F4',
    textAlign: 'right',
    flexGrow: 0,
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
  button: {
    width: 216,
    display: 'block',
    borderRadius: 4,
    margin: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    letterSpacing: '-0.25px',
    padding: 8,
    wordSpacing: '1px',
  },
  description: {
    fontSize: '16px',
    fontWeight: 500,
    lineHeight: '24px',
  },
}));

export default function LandingPage() {
  const classes = useStyles();
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const logoutWithRedirect = () =>
    logout({
      returnTo: window.location.origin,
    });

  return (
    <div className={classes.page}>
      <main className={classes.contentContainer}>
        <header className={classes.header}>
          <h1 className={classes.title}>
            Comet Planning
            </h1>
          <p className={classes.description}>Plan out classes and more for your time at UTD.</p>
          <div className="buttonBlock">
            <div>
              <Button variant="contained" className={classes.button} color="primary" component={Link} to="/schedules/new">
                Start from scratch
              </Button>
              <Button variant="contained" className={classes.button} color="primary" component={Link} to="/schedules/new?withCredits=true">
                Start with credits
              </Button>
              <Button variant="contained" className={classes.button} color="primary" component={Link} to="/schedules/new?import=true">
                Import existing plan
              </Button>
              <Button variant="contained" className={classes.button} color="secondary" component={Link} to="/schedules">
                My schedules
              </Button>
              {!isAuthenticated && (
                <Button variant="contained" className={classes.button} color="secondary" onClick={() => loginWithRedirect()}>
                  Sign in with account
                </Button>
              )}
              {isAuthenticated && (
                <Button variant="contained" className={classes.button} color="secondary" onClick={() => logout()}>
                  Sign out
                </Button>
              )}
            </div>
          </div>
        </header>
      </main>
      <footer className={classes.footer}>
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
      </footer>
    </div>
  );
}
