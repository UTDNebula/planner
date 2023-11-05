import * as React from 'react';
import Head from 'next/head';

import ProfilePage from '@/components/home/Profile';

// import useMedia from '../../utils/media';

export default function MiniDrawer() {
  // const isDesktop = useMedia('(min-width: 900px)');

  return (
    <>
      <Head>
        <link rel="canonical" href="https://planner.utdnebula.com/app/profile" key="canonical" />
        <meta property="og:url" content="https://planner.utdnebula.com/app/profile" />
      </Head>
      <ProfilePage isDesktop={true} />
    </>
  );
}

MiniDrawer.auth = true;
