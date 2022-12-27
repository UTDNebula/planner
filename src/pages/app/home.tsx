
import * as React from 'react';

import Credits from '../../components/newhome/Credits';
import Home from '../../components/newhome/Home';
import HomeDrawer from '../../components/newhome/HomeDrawer';
import Profile from '../../components/newhome/Profile';
import useMedia from '../../modules/common/media';

export default function MiniDrawer() {
  const isDesktop = useMedia('(min-width: 900px)');
  const content = [
    <Home key={0} />,
    <Profile isDesktop={isDesktop} key={1} />,
    <Credits key={2} />,
  ];

  return (
    <>
      <HomeDrawer isDesktop={isDesktop} />
      <Home key={0} />
    </>
  );
}

MiniDrawer.auth = true;
