import * as React from 'react';

import ProfilePage from '@/components/home/Profile';

// import useMedia from '../../utils/media';

export default function MiniDrawer() {
  // const isDesktop = useMedia('(min-width: 900px)');

  return <ProfilePage isDesktop={true} />;
}

MiniDrawer.auth = true;
