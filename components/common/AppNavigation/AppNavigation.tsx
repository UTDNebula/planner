import React from 'react';
import { Divider, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { AccountBox, ExitToApp, Home, ListAlt, School } from '@material-ui/icons';
import HomeUserInfo from '../../home/HomeUserInfo';
import Link from 'next/link';
import { useAuthContext } from '../../../modules/auth/auth-context';

/**
 * A navigation drawer that links to various screens in the app.
 * TODO: Make drawer responsive across all screen sizes
 * TODO: Implement section indicator
 * TODO: Restyle this component
 * TODO: Figure out what functionality should go here and what should go inside NavigationBar
 */
export default function AppNavigation(): JSX.Element {
  // TODO: Highlight active item based on current location
  const { isSignedIn } = useAuthContext();

  /* Decides if the button should be login or 
  sign out based on the current auth state */
  const authItem = {
    route: isSignedIn ? '/app/auth/signOut' : '/app/auth/login',
    label: isSignedIn ? 'Sign out' : 'Sign in',
  };

  return (
    <nav className="w-[360px]">
      <div className="px-4 py-8 bg-blue-100">
        <HomeUserInfo />
      </div>
      <List>
        <Link href="/app" passHref>
          <ListItem button component="a">
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Overview" />
          </ListItem>
        </Link>
        <Link href="/app/profile" passHref>
          <ListItem button component="a">
            <ListItemIcon>
              <AccountBox />
            </ListItemIcon>
            <ListItemText primary="Manage profile" />
          </ListItem>
        </Link>
        <Link href="/app/plans" passHref>
          <ListItem button component="a">
            <ListItemIcon>
              <School />
            </ListItemIcon>
            <ListItemText primary="View your plans" />
          </ListItem>
        </Link>
        <Divider variant="middle" />
        <Link href="/app/resources" passHref>
          <ListItem button component="a">
            <ListItemIcon>
              <ListAlt />
            </ListItemIcon>
            <ListItemText primary="Academic Resources" />
          </ListItem>
        </Link>
        <Link href={authItem.route} passHref>
          <ListItem button component="a">
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary={authItem.label} />
          </ListItem>
        </Link>
      </List>
    </nav>
  );
}
