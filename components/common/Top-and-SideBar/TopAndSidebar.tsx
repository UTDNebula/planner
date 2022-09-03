import React, { ComponentProps } from 'react';
import HomeDrawer from './HomeDrawer';
import HomeNavbar from './HomeNavbar';

export default function TopAndSidebar({
  children,
}: any): React.PropsWithChildren<React.ReactElement> {
  const [open, setOpen] = React.useState(true);

  return (
    <div className="antialiased w-screen h-screen overflow-hidden flex flex-row bg-blue-900">
      <HomeDrawer open={open} setOpen={setOpen} />

      <div className="flex-grow flex flex-col">
        <HomeNavbar open={open} setOpen={setOpen} />
        <div className="flex-grow">{children}</div>
      </div>
    </div>
  );
}
