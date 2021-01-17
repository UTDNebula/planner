import React from 'react';
import { useLocation } from 'react-router-dom';

/**
 * A hook that exposes global app path location.
 */
export function useAppLocation(): AppLocationHandle {
  const [title, setTitle] = React.useState('Comet Planning');
  const location = useLocation();

  const updateTitle = (title: string) => {
    setTitle(`Comet Planning${title != '' ? ' - ' : ''}${title}`);
  };

  return {
    title: title,
    path: location.pathname, // TODO
    updateTitle: updateTitle,
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
   * Sets the descriptor for the title.
   *
   * For example, updateTitle('Overview') would result in the title becoming
   * 'Comet Planning - Overview
   */
  updateTitle: (title: string) => void;
};
