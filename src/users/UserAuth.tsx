import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useAuth0 } from '@auth0/auth0-react';
import { StudentData } from '../store/user/types';
import { RootState } from '../store/reducers';
import { updateStudentData } from '../store/user/thunks';
import { fetchStudent, uploadStudent } from '../lib/api/index';

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

  if (isAuthenticated) {
    const student = SaveUserToLocalStorage();
    SaveUserToFirebase(student);
  }

  const logoutWithRedirect = () =>
    logout({
      returnTo: window.location.origin,
    });

  function SaveUserToLocalStorage() {
    const student: StudentData = {
      id: user.sub,
      name: user.name,
      picture: user.picture,
      startTerm: '',
      endTerm: '',
      classification: '',
      attemptedCreditHours: 0,
      gpa: 0,
      attemptedCourses: [],
      requirements: [],
    };
    console.log(user);
    updateStudentData(student);
    return student;
  }

  async function SaveUserToFirebase(user: StudentData) {
    const response = await fetchStudent(user.id);
    if (!response) {
      await uploadStudent(user);
      console.log('added to database with id', user.id);
    } else {
      console.log('user already exists');
      console.log(response);
    }
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
          <Button
            variant="contained"
            className={classes.button}
            color="secondary"
            onClick={() => logoutWithRedirect()}
          >
            Sign out
          </Button>
        </>
      )}
    </div>
  );
}
