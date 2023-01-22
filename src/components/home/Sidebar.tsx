import ChevronIcon from '@/icons/ChevronIcon';
import CreditsIcon from '@/icons/CreditsIcon';
import HomeIcon from '@/icons/HomeIcon';
import LogoutIcon from '@/icons/LogoutIcon';
import ProfileIcon from '@/icons/ProfileIcon';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Sidebar({ isMobile }: { isMobile: boolean }): JSX.Element {
  const [open, setOpen] = useState(!isMobile);

  useEffect(() => setOpen(!isMobile), [isMobile]);

  const sidebarItems = [
    {
      url: '/app/home',
      label: 'Home',
      Icon: HomeIcon,
    },
    {
      url: '/app/profile',
      label: 'Profile',
      Icon: ProfileIcon,
    },
    {
      url: '/app/credits',
      label: 'Credits',
      Icon: CreditsIcon,
    },
  ];

  return (
    <>
      <div
        className={`${
          open ? 'w-[240px] shrink-0' : 'w-auto'
        } flex flex-col bg-white border-r-[1px] border-r-[#e0e0e0] h-screen max-h-screen  transition-all`}
      >
        {!isMobile && (
          <div
            className={`${open ? 'justify-between' : 'justify-center'} flex items-center h-16 p-4`}
          >
            {open && <h4 className="text-defaultText">Planner</h4>}
            <ChevronIcon
              onClick={() => setOpen(!open)}
              className={`w-5 h-5 cursor-pointer ${!open ? '' : 'rotate-180'}`}
              strokeWidth={2.5}
            />
          </div>
        )}
        <ul className="flex flex-col">
          {sidebarItems.map(({ url, label, Icon }, i) => (
            <Link key={url + i} href={url}>
              <li className="flex gap-6 items-center px-5 py-3 cursor-pointer">
                <Icon className="w-6 h-6" />
                {open && <span>{label}</span>}
              </li>
            </Link>
          ))}
        </ul>
        <div className="flex-grow"></div>

        <button
          className="align-bottom px-5  pb-5 flex gap-6 items-center"
          onClick={() => signOut()}
        >
          <LogoutIcon className="w-6 h-6" />
          {open && <span>Log Out</span>}
        </button>
      </div>
    </>
  );
}
