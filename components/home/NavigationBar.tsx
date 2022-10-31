import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { useAuthContext } from '../../modules/auth/auth-context';
import logo from '../../public/logo.png';

// TODO: Unused; refactor navigationbar for Planner v1
export default function HomeNavigationBar() {
  const { isUserSignedIn } = useAuthContext();
  const router = useRouter();

  const authItem = {
    route: isUserSignedIn ? '/auth/signOut' : '/auth/login',
    label: isUserSignedIn ? 'Sign out' : 'Sign in',
  };

  const handleAuthUpdate = () => {
    router.push(authItem.route);
  };

  return (
    <AppBar position="relative">
      <Toolbar className="flex flex-row">
        <IconButton onClick={() => router.push('/')} className="" size="large">
          <Image src={logo} alt="Logo" width="40px" height="40px" className="rounded-full" />
        </IconButton>
        <div className="flex-1"></div>
        <Button onClick={handleAuthUpdate} className="text-white">
          <Typography variant="subtitle1" color="initial" noWrap className="text-white">
            {authItem.label}
          </Typography>
        </Button>
      </Toolbar>
    </AppBar>
  );
}
