import { Box, Typography } from '@material-ui/core';
import React from 'react';
import { useAuthContext } from '../../modules/auth/auth-context';
import Image from 'next/image';
import logo from '../../public/Nebula_Planner_Logo.png';
import Link from 'next/link';

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

  return (
    <div className="bg-white md:shadow-lg shadow-none rounded p-6 w-96">
      <div className="mb-4 flex justify-center items-center">
        <Image src={logo} alt="Logo" width="120px" height="120px" className="rounded-full" />
      </div>
      <h1 className="text-center text-3xl mb-2 font-semibold leading-normal">
        Sign Up with Nebula
      </h1>
      <section className="space-y-5 mt-5">
        <div className="mb-4 relative">
          <input
            value={email}
            onChange={handleEmailChange}
            type="email"
            className="w-full border border-black p-3 rounded outline-none focus:border-black"
            placeholder="Email or Phone"
          ></input>
        </div>
        <div className="mb-4 relative">
          <input
            value={password}
            onChange={handlePasswordChange}
            type="password"
            className="w-full border border-black p-3 rounded outline-none focus:border-black"
            placeholder="Password"
          ></input>
        </div>
        <button
          onClick={handleEmailSignUp}
          className="w-full text-center bg-blue-700 hover:bg-blue-800 rounded-lg text-white py-3 font-medium"
        >
          Sign Up
        </button>
        <div className="flex place-content-center">
          <p>
            Already have an account?
            <Link href="/app/auth/login">
              <a className="ml-2 text-blue-700 font-semibold hover:bg-blue-200 hover:rounded-lg">
                Sign In
              </a>
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
