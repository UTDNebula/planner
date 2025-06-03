import React from 'react';

import useMedia from '@/utils/media';

import Sidebar from './Sidebar';

export default function Layout({
  children,
}: React.PropsWithChildren<Record<string, unknown>>): JSX.Element {
  const isDesktop = useMedia('(min-width: 900px)');

  return (
    <div className="flex h-full w-full bg-[#F5F5F5]">
      <Sidebar isMobile={!isDesktop} />
      {children}
    </div>
  );
}
