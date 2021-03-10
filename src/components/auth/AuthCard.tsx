import { Button, Tab, Tabs, TextField } from '@material-ui/core';
// import firebase from 'firebase';
import 'firebase/auth';
import React from 'react';
import { Link /* useHistory */ } from 'react-router-dom';
import { useAuthContext } from '../../features/auth/auth-context';

/**
 * Generate ARIA element attributes for a11y.
 */
function generateA11yProps(index: number) {
  return {
    id: `auth-dialog-tab-${index}`,
    'aria-controls': `auth-dialog-controls-${index}`,
  };
}

/**
 * Component properties for an AuthDialog.
 */
interface AuthCardProps {
  /**
   * A callback triggered when the user has indicated they have forgotten their password.
   */
  onForgetPassword: (email: string) => void;

  /**
   * A callback triggered when the user tries signing in or signing up with Google.
   */
  onGoogleSignIn: () => void;
}

/**
 * A dialog that exposes different sign-in/sign-up methods.
 */
export default function AuthCard({ onForgetPassword, onGoogleSignIn }: AuthCardProps): JSX.Element {
  const { signInWithEmail } = useAuthContext();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  // const [inForgetPasswordFlow, setInForgetPasswordFlow] = React.useState(false);

  const handleEmailSignIn = () => {
    signInWithEmail(email, password);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
  };

  const handlePasswordReset = () => {
    onForgetPassword(email);
  };

  const [activeSection, setActiveSection] = React.useState(0);

  const handleTabChange = (event: React.ChangeEvent<Record<string, never>>, newValue: number) => {
    setActiveSection(newValue);
  };

  const inSignUp = activeSection === 1;

  const titleText = `${inSignUp ? 'Sign up for ' : 'Sign into '} Comet Planning`;

  return (
    <div className="m-2 bg-white md:rounded-md md:shadow-md">
      <header className="bg-yellow-300">
        <div className="text-headline6 font-bold p-4">{titleText}</div>
        <Tabs
          value={activeSection}
          onChange={handleTabChange}
          aria-label="Sign in or Sign up"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Sign in" {...generateA11yProps(0)} />
          <Tab label="Sign up" {...generateA11yProps(1)} />
        </Tabs>
      </header>
      <div className="py-4 text-center">
        <Button
          variant="contained"
          onClick={() => {
            onGoogleSignIn();
          }}
        >
          Sign up with Google
        </Button>
        <div className="text-caption font-bold px-2 mt-4">OR</div>
      </div>
      <form className="p-4">
        <div className="text-caption font-bold text-blue-400 p-2">Email</div>
        <TextField
          id="email"
          label=""
          variant="filled"
          value={email}
          onChange={handleEmailChange}
        />
        <div className="text-caption font-bold text-blue-400 p-2">Password</div>
        <TextField
          id="password"
          label=""
          variant="filled"
          value={password}
          onChange={handlePasswordChange}
        />
        <Button variant="contained" onClick={handleEmailSignIn}>
          Sign in
        </Button>
        <div>
          <span className="py-2 text-blue-500 hover:text-blue-700" onClick={handlePasswordReset}>
            Forgot password
          </span>
        </div>
      </form>
      <div className="p-2 text-center">
        <Link className="text-blue-700 underline" to="/terms">
          Terms
        </Link>
        &nbsp;|&nbsp;
        <Link className="text-blue-700 underline" to="/privacy">
          Privacy
        </Link>
      </div>
    </div>
  );
}
