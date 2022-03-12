import React from 'react';
import { Avatar, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import AccountIcon from '@mui/icons-material/AccountCircle';
import AccountBox from '@mui/icons-material/AccountBox';
import { ExitToApp } from '@mui/icons-material';
import Link from 'next/link';
import styles from './ProfileIcon.module.css';
import { useAuthContext } from '../../../../modules/auth/auth-context';

/**
 * Component properties for a {@link ProfileIcon}.
 */
interface ProfileIconProps {
  onSignIn: () => void;
  onSignOut: () => void;
}

/**
 * A profile icon that triggers a user profile dialog when clicked.
 */
export default function ProfileIcon(props: ProfileIconProps): JSX.Element {
  props; // TODO: Remove me when used
  const { user, authWithRedirect } = useAuthContext();

  const [dialogIsOpen, setDialogIsOpen] = React.useState(false);
  const [profileAnchor, setProfileAnchor] = React.useState<null | HTMLElement>(null);

  const handleClose = () => {
    setProfileAnchor(null);
    setDialogIsOpen(false);
  };

  const handleSignInClick = () => {
    // TODO: Just use current route
    authWithRedirect('/app');
    setDialogIsOpen(false);
  };

  const handleIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchor(event.currentTarget);
    setDialogIsOpen(true);
  };

  const { name, image } = user;

  const { isUserSignedIn } = useAuthContext();

  const userData = {
    classification: 'Junior',
    major: 'Computer Science', // TODO: Fetch from store
  };

  const avatarIcon =
    isUserSignedIn && image != null ? (
      <Avatar alt={image} src={image} />
    ) : (
      <Avatar alt={name}>
        <AccountIcon />
      </Avatar>
    );
  return (
    <div>
      <IconButton
        aria-label={name}
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleIconClick}
        color="inherit"
        size="large"
      >
        {avatarIcon}
      </IconButton>
      <Menu
        id="menu-appbar"
        className={styles.dialog}
        anchorEl={profileAnchor}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={dialogIsOpen}
        onClose={handleClose}
      >
        {/* TODO: Include prettier dialog like Google's account switcher */}
        <div className="w-full p-4 flex bg-gray-100">
          {/* TODO: Shared component transition between profile icon and dialog */}
          <div className="h-12 flex-0">{avatarIcon}</div>
          <div className="mx-4">
            <div className="text-headline6 font-bold">{name}</div>
            <div className="text-subtitle1 font-bold">
              <span className="">{userData.classification}</span>, <span>{userData.major}</span>
            </div>
          </div>
        </div>
        {isUserSignedIn ? (
          [
            <MenuItem component={Link} href="/app/profile" key="profile">
              <ListItemIcon>
                <AccountBox />
              </ListItemIcon>
              <ListItemText primary="Manage profile" />
            </MenuItem>,
            <MenuItem component={Link} href="/app/auth/signOut" key="auth">
              <ListItemIcon>
                <ExitToApp />
              </ListItemIcon>
              <ListItemText primary="Sign out" />
            </MenuItem>,
          ]
        ) : (
          <MenuItem component={Link} href="/app/auth/Login">
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary="Sign in" secondary="Log in for more functionality" />
          </MenuItem>
        )}
        <div className="p-2 text-center">
          <Link href="/terms">
            <span className="text-blue-700 underline">Terms</span>
          </Link>
          &nbsp;|&nbsp;
          <Link href="/privacy">
            <span className="text-blue-700 underline">Privacy</span>
          </Link>
        </div>
      </Menu>
    </div>
  );
}
