import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useTheme } from 'styled-components';
import { useAuth0 } from "@auth0/auth0-react";
import {getUserData} from "../schedules/actions";

const useStyles = makeStyles((theme) => ({
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
}));

export default function UserAuth() {
  const classes = useStyles();
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const logoutWithRedirect = () =>
    logout({
      returnTo: window.location.origin,
    });

  function AddDataToFirestore() {
    //add user to database here if not already exist
    
    console.log("added to database with id", user.sub);
    return (<></>);
  };

  return (
        <div>
            {!isAuthenticated && (
            <Button variant="contained" className={classes.button} color="secondary" onClick={() => loginWithRedirect()}>
                Sign in with account
            </Button>
            )}
            {isAuthenticated && (
            <>
                <AddDataToFirestore/>
                <Button variant="contained" className={classes.button} color="secondary" onClick={() => logout()}>
                Sign out
                </Button>
            </>
            )}
        </div>
    );
}
