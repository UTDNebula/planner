import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { useAuthContext } from '../../modules/auth/auth-context';
import logo from '../../public/Nebula_Planner_Logo.png';

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
export default function AuthCard(): JSX.Element {
  const { signUpWithEmail } = useAuthContext();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleEmailSignUp = () => {
    signUpWithEmail(email, password);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSignInWithGoogle = () => {
    signInWithGoogle();
  };

  return (
    <div className="p-6 bg-white rounded shadow-none md:shadow-lg w-96">
      <div className="flex items-center justify-center mb-4">
        <Image src={logo} alt="Logo" width="120px" height="120px" className="rounded-full" />
      </div>
      <h1 className="mb-2 text-3xl font-semibold leading-normal text-center">
        Sign Up with Nebula
      </h1>
      <section className="mt-5 space-y-5">
        <div className="relative mb-4">
          <input
            value={email}
            onChange={handleEmailChange}
            type="email"
            className="w-full p-3 border border-black rounded outline-none focus:border-black"
            placeholder="Email Address"
          ></input>
        </div>
        <div className="relative mb-4">
          <input
            value={password}
            onChange={handlePasswordChange}
            type="password"
            className="w-full p-3 border border-black rounded outline-none focus:border-black"
            placeholder="Password"
          ></input>
        </div>
        <button
          onClick={handleEmailSignUp}
          className="w-full py-3 font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800"
        >
          Sign Up
        </button>
        <div className="items-center pb-1 mx-auto -mb-6">
          <h1 className="text-center text-gray-700 text-s">or</h1>
        </div>
        <button
          onClick={handleSignInWithGoogle}
          className="items-center justify-center block w-full px-3 py-3 leading-tight text-gray-700 bg-gray-100 border border-gray-500 rounded-lg shadow appearance-none hover:bg-gray-200 hover:text-gray-700 focus:outline-none"
        >
          <h1 className="text-xl text-center text-blue-700">Sign up with Google</h1>
        </button>
        <div className="flex place-content-center">
          <p>
            Already have an account?
            <Link href="/auth/login">
              <a className="ml-2 font-semibold text-blue-700 hover:bg-blue-200 hover:rounded-lg">
                Sign In
              </a>
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
