import React from 'react';
import { Avatar, IconButton, Menu, MenuItem } from '@material-ui/core';
import AccountIcon from '@material-ui/icons/AccountCircle';

/**
 * Component properties for a {@link ProfileIcon}.
 */
interface ProfileIconProps {
  userImage: string | null;
  userName: string;
  isSignedIn: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
  onAccountProfileClick: () => void;
}

/**
 * A profile icon that triggers a user profile dialog when clicked.
 */
export default function ProfileIcon(props: ProfileIconProps) {
  const { userImage, userName, isSignedIn, onSignIn, onSignOut, onAccountProfileClick } = props;

  const [dialogIsOpen, setDialogIsOpen] = React.useState(false);
  const [profileAnchor, setProfileAnchor] = React.useState<null | HTMLElement>(null);

  const handleClose = () => {
    setProfileAnchor(null);
    setDialogIsOpen(false);
  };

  const handleProfileClick = () => {
    onAccountProfileClick();
    setDialogIsOpen(false);
  };

  const handleSignOutClick = () => {
    onSignOut();
    setDialogIsOpen(false);
  };

  const handleSignInClick = () => {
    onSignIn();
    setDialogIsOpen(false);
  };

  const handleIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchor(event.currentTarget);
    setDialogIsOpen(true);
  };

  const avatarIcon = isSignedIn && userImage != null
    ? (
      <Avatar alt={userName} src={userImage} />
    )
    : (
      <Avatar alt={userName}>
        <AccountIcon />
      </Avatar>
    );
  return (
    <div>
      <IconButton
        aria-label={userName}
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleIconClick}
        color="inherit"
      >
        {avatarIcon}
      </IconButton>
      <Menu
        id="menu-appbar"
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
        {isSignedIn
          ?
          <div>
            <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
            <MenuItem onClick={handleSignOutClick}>Sign out</MenuItem>
          </div>
          :
          <MenuItem onClick={handleSignInClick}>Sign in</MenuItem>
        }
      </Menu>
    </div>
  );
}