import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useAuth0 } from '@auth0/auth0-react';
import { StudentData } from '../store/user/types';
import { RootState } from '../store/reducers';
import { updateStudentData } from '../store/user/thunks';

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

  function SaveUser() {
    const student: StudentData = {
      id: user.sub,
      name: '',
      startTerm: '2020f',
      endTerm: '2024f',
      classification: 'fr',
      attemptedCreditHours: 0,
      gpa: 0,
      attemptedCourses: [],
      requirements: [],
    };
    updateStudentData(student);
    console.log('added to database with id', user.sub);
    return <></>;
  }

  return (
    <div>
      {!isAuthenticated && (
        <Button
          variant="contained"
          className={classes.button}
          color="secondary"
          onClick={() => loginWithRedirect()}
        >
          Sign in with account
        </Button>
      )}
      {isAuthenticated && (
        <>
          <SaveUser />
          <Button
            variant="contained"
            className={classes.button}
            color="secondary"
            onClick={() => logout()}
          >
            Sign out
          </Button>
        </>
      )}
    </div>
  );
}
