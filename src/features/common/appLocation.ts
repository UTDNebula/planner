import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

type Location = 'root' | 'profile' | 'auth' | 'planner';

const ROUTES: { [locationId in Location]: { path: string; title: string } } = {
  root: {
    path: '/app',
    title: '',
  },
  profile: {
    path: '/profile',
    title: 'Your profile',
  },
  auth: {
    path: '/auth',
    title: 'Your profile',
  },
  planner: {
    path: '/plan',
    title: 'Your plan',
  },
};

/**
 * A hook that exposes global app path location.
 */
export function useAppLocation(): AppLocationHandle {
  const [title, setTitle] = React.useState('Comet Planning');
  const [locationId, setLocationId] = React.useState<Location>('root');

  const location = useLocation();
  const history = useHistory();

  const updateTitle = (title: string) => {
    setTitle(`Comet Planning${title != '' ? ' - ' : ''}${title}`);
  };

  const navigateTo = (location: Location) => {
    const { path, title } = ROUTES[location];
    setLocationId(location);
    setTitle(title);
    history.push(path);
  };

  return {
    title: title,
    path: location.pathname, // TODO
    locationId: locationId,
    updateTitle: updateTitle,
    navigateTo: navigateTo,
  };
}

/**
 * App location attributes and modifers.
 */
type AppLocationHandle = {
  /**
   * The text displayed in the browser's title.
   */
  title: string;

  /**
   * The pathname of the URL.
   */
  path: string;

  /**
   * One of the locations in this app.
   */
  locationId: Location;

  /**
   * Sets the descriptor for the title.
   *
   * For example, updateTitle('Overview') would result in the title becoming
   * 'Comet Planning - Overview
   */
  updateTitle: (title: string) => void;

  /**
   * Switches the current location of the app to the given one.
   */
  navigateTo: (locationId: Location) => void;
};
