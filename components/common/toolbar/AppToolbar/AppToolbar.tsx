import BackIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { makeStyles } from 'tss-react/mui';

import { useAuthContext } from '../../../../modules/auth/auth-context';
import ProfileIcon from '../ProfileIcon/ProfileIcon';

const useStyles = makeStyles()((theme) => {
  return {
    root: {
      zIndex: theme.zIndex.drawer + 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  };
});

interface AppToolbarProps {
  title?: string;
  shouldShowProfile: boolean;
  // TODO: Maybe use context for viewing/planning modes
}

/**
 * Note: UNUSED component
 * TODO: Either use or remove for Planner v1
 */
export default function AppToolbar(props: AppToolbarProps): JSX.Element {
  const { shouldShowProfile } = props;

  const title = 'Nebula';

  const { classes } = useStyles();

  const { signOut } = useAuthContext();

  const router = useRouter();

  const [inDetail, setInDetail] = React.useState(false);

  const determineLeftButtonLabel = () => {
    if (inDetail) {
      // TODO: Determine based on viewing/planning context
      return 'Menu';
    }
    return 'Back';
  };

  const handleSignOut = () => {
    signOut();
    // TODO: Verify success
    router.replace('/');
  };

  const handleSignIn = () => {
    router.push('/auth/login');
  };

  const handleBackButtonClick = () => {
    setInDetail(false);
  };

  const leftButtonIcon = inDetail ? <BackIcon onClick={handleBackButtonClick} /> : <MenuIcon />;

  return (
    <AppBar position="fixed" className={classes.root}>
      <Toolbar>
        <IconButton
          className={classes.menuButton}
          edge="start"
          color="inherit"
          aria-label={determineLeftButtonLabel()}
          size="large"
        >
          {leftButtonIcon}
        </IconButton>
        <Link href="/app">
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
        </Link>
        {shouldShowProfile && <ProfileIcon onSignIn={handleSignIn} onSignOut={handleSignOut} />}
      </Toolbar>
    </AppBar>
  );
}
