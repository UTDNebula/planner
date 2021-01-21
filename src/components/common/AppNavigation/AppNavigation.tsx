import React from 'react';
import { Divider, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { AccountBox, ExitToApp, Home, ListAlt, School } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../../features/auth/auth-context';
// import { useAppLocation } from '../../../features/common/appLocation';
import HomeUserInfo from '../../home/HomeUserInfo';
import styles from './AppNavigation.module.css';

/**
 * A navigation drawer that links to various screens in the app.
 */
export default function AppNavigation(): JSX.Element {
  // TODO: Highlight active item based on current location
  // const { locationId } = useAppLocation();
  const { isSignedIn } = useAuthContext();

  const authItem = {
    route: isSignedIn ? '/auth/signOut' : '/auth/signIn',
    label: isSignedIn ? 'Sign out' : 'Sign in',
  };

  return (
    <nav className={styles.AppNavigation}>
      <div className="px-4 py-8 bg-blue-100">
        <HomeUserInfo />
      </div>
      <List>
        <ListItem button component={Link} to="/app">
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText primary="Overview" />
        </ListItem>
        <ListItem button component={Link} to="/app/profile">
          <ListItemIcon>
            <AccountBox />
          </ListItemIcon>
          <ListItemText primary="Manage profile" />
        </ListItem>
        <ListItem button component={Link} to="/app/plans">
          <ListItemIcon>
            <School />
          </ListItemIcon>
          <ListItemText primary="View your plans" />
        </ListItem>
        <Divider variant="middle" />
        <ListItem button component={Link} to="/app/resources">
          <ListItemIcon>
            <ListAlt />
          </ListItemIcon>
          <ListItemText primary="Academic Resources" />
        </ListItem>
        <ListItem button component={Link} to={authItem.route}>
          <ListItemIcon>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary={authItem.label} />
        </ListItem>
      </List>
    </nav>
  );
}
