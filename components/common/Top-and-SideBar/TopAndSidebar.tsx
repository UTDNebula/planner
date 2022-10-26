import { useRouter } from 'next/router';
import React from 'react';

import HomeDrawer from './HomeDrawer';
import HomeNavbar from './HomeNavbar';

export default function TopAndSidebar({
  children,
}: any): React.PropsWithChildren<React.ReactElement> {
  const [open, setOpen] = React.useState(true);
  const router = useRouter();

  return (
    <div className="antialiased w-screen min-h-screen flex flex-row bg-blue-900">
      <HomeDrawer open={open} setOpen={setOpen} />

      <div className="flex-grow flex flex-col">
        <HomeNavbar open={open} setOpen={setOpen} router={router} />
        <div className="flex-grow">{children}</div>
      </div>
    </div>
  );
}
