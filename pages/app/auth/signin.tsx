import { Box, Button, Tab, Tabs, TextField, Typography } from '@material-ui/core';
import 'firebase/auth';
import Link from 'next/link';
import React from 'react';
import { useAuthContext } from '../../../modules/auth/auth-context';
import logo from '../../../public/logo.png';
import googleLogo from '../../../public/googleLogo.png';
import Image from 'next/image';

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

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

/**
 * A dialog that exposes different sign-in/sign-up methods.
 */
export default function AuthCard({ onForgetPassword, onGoogleSignIn }: AuthCardProps): JSX.Element {
  const { signInWithEmail, signInWithGoogle } = useAuthContext();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSignInWithGoogle = (event) => {
    event.preventDefault();
    signInWithGoogle();
  };

  // const [inForgetPasswordFlow, setInForgetPasswordFlow] = React.useState(false);

  const handleEmailSignIn = (event) => {
    event.preventDefault();
    signInWithEmail(email, password);
  };

  return (
    <div className="h-screen bg-white relative flex flex-col space-y-10 justify-center items-center">
      <div className="bg-white md:shadow-lg shadow-none rounded p-6 w-96 ">
        <div className="flex justify-center items-center">
          <Image src={logo} alt="Logo" width="80px" height="80px" className="rounded-full" />
        </div>
        <h1 className="text-center text-3xl mb-2 font-semibold leading-normal">Sign in</h1>
        <p className="text-sm leading-normal">
          Log in to your Nebula Profile to continue to Planner.
        </p>
        <form className="space-y-5 mt-5">
          <div className="mb-4 relative">
            <input
              type="email"
              className="w-full border border-black p-3 rounded outline-none focus:border-black"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
            ></input>
          </div>
          <div className="mb-4 relative">
            <input
              type="password"
              className="w-full border border-black p-3 rounded outline-none focus:border-black"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            ></input>
          </div>
          {/* <div className="-m-2">
            <a
              className="font-semibold text-blue-700 hover:bg-blue-100 hover:p-5 p-2 rounded-lg"
              href="#"
            >
              Forgot password?
            </a>
          </div> */}
          <button
            onClick={handleEmailSignIn}
            className="w-full text-center bg-blue-700 hover:bg-blue-800 rounded-lg text-white py-3 font-medium"
          >
            Sign in
          </button>
          <div className="items-center mx-auto -mb-6 pb-1">
            <h1 className="text-center text-s text-gray-700">or</h1>
          </div>
          <button
            onClick={handleSignInWithGoogle}
            className="appearance-none flex items-center justify-center block w-full bg-gray-100 text-gray-700 shadow border border-gray-500 rounded-lg py-3 px-3 leading-tight hover:bg-gray-200 hover:text-gray-700 focus:outline-none"
          >
            <h1 className="text-center text-xl text-blue-700">Sign in with Google</h1>
          </button>
        </form>
      </div>
      <div className="flex place-content-center">
        <p>
          New to Nebula?
          <a
            className="text-blue-700 font-semibold hover:bg-blue-200 hover:p-5 p-2 rounded-lg"
            href="/app/auth/signup"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
