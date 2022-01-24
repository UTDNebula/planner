import { AppBar, Button, IconButton, Toolbar, Typography } from '@material-ui/core';
import logo from '../../public/logo.png';
import Image from 'next/image';
import { useAuthContext } from '../../modules/auth/auth-context';
import { useRouter } from 'next/router';

export default function HomeNavigationBar() {
  const { isSignedIn } = useAuthContext();
  const router = useRouter();

  const authItem = {
    route: isSignedIn ? '/app/auth/signOut' : '/app/auth/signIn',
    label: isSignedIn ? 'Sign out' : 'Sign in',
  };

  const handleAuthUpdate = () => {
    router.push(authItem.route);
  };

  return (
    <AppBar position="relative">
      <Toolbar className="flex flex-row">
        <IconButton onClick={() => router.push('/')} className="">
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
