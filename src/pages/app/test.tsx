import Layout from '@/components/newhome/Layout';
import { useState } from 'react';

import Credits from '../../components/newhome/Credits';
import Home from '../../components/newhome/Home';
import Profile from '../../components/newhome/Profile';
import useMedia from '../../modules/common/media';

export default function TestPage() {
  const isDesktop = useMedia('(min-width: 900px)');

  return (
    // <HomeDrawer page={page} setPage={setPage} isDesktop={isDesktop}>
    //   <div className="w-full max-h-screen bg-[#F5F5F5]">{content[page]}</div>
    // </HomeDrawer>
    <Layout>
      <Home />
    </Layout>
  );
}
