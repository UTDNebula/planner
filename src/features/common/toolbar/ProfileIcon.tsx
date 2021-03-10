import React from 'react';
import { Avatar, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@material-ui/core';
import AccountIcon from '@material-ui/icons/AccountCircle';
import { Link } from 'react-router-dom';
import AccountBox from '@material-ui/icons/AccountBox';
import { ExitToApp } from '@material-ui/icons';
import styles from './ProfileIcon.module.css';
import { useAuthContext } from '../../auth/auth-context';

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

  const isSignedIn = user.id !== 'guest';

  const userData = {
    classification: 'Junior',
    major: 'Computer Science', // TODO: Fetch from store
  };

  const avatarIcon =
    isSignedIn && image != null ? (
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
        {isSignedIn ? (
          [
            <MenuItem component={Link} to="/app/profile" key="profile">
              <ListItemIcon>
                <AccountBox />
              </ListItemIcon>
              <ListItemText primary="Manage profile" />
            </MenuItem>,
            <MenuItem component={Link} to="/auth/signOut" key="auth">
              <ListItemIcon>
                <ExitToApp />
              </ListItemIcon>
              <ListItemText primary="Sign out" />
            </MenuItem>,
          ]
        ) : (
          <MenuItem component={Link} to="/auth/signIn" onClick={handleSignInClick}>
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary="Sign in" secondary="Log in for more functionality" />
          </MenuItem>
        )}
        <div className="p-2 text-center">
          <Link className="text-blue-700 underline" to="/terms">
            Terms
          </Link>
          &nbsp;|&nbsp;
          <Link className="text-blue-700 underline" to="/privacy">
            Privacy
          </Link>
        </div>
      </Menu>
    </div>
  );
}
