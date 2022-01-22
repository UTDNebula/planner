import { Box, Button, Tab, Tabs, TextField, Typography } from '@material-ui/core';
import 'firebase/auth';
import Link from 'next/link';
import React from 'react';
import { useAuthContext } from '../../modules/auth/auth-context';

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
  const { signInWithEmail, signUpWithEmail } = useAuthContext();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  // const [inForgetPasswordFlow, setInForgetPasswordFlow] = React.useState(false);

  const handleEmailSignUp = () => {
    signUpWithEmail(email, password);
  };

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

  const [activeSection, setActiveSection] = React.useState<number>(0);

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
      <TabPanel value={activeSection} index={0}>
        <div className="py-4 text-center">
          <Button
            variant="contained"
            onClick={() => {
              onGoogleSignIn();
            }}
          >
            Sign in with Google
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
            type="password"
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
      </TabPanel>
      <TabPanel value={activeSection} index={1}>
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
            type="password"
            onChange={handlePasswordChange}
          />
          <Button variant="contained" onClick={handleEmailSignUp}>
            Sign up
          </Button>
        </form>
      </TabPanel>
      <div className="p-2 text-center">
        <Link href="/terms">
          <span className="text-blue-700 underline">Terms</span>
        </Link>
        &nbsp;|&nbsp;
        <Link href="/privacy">
          <span className="text-blue-700 underline">Privacy</span>
        </Link>
      </div>
    </div>
  );
}
