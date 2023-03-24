import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';

import ChevronIcon from '@/icons/ChevronIcon';
import HomeIcon from '@/icons/HomeIcon';
import LogoutIcon from '@/icons/LogoutIcon';
import ProfileIcon from '@/icons/ProfileIcon';
import { useRouter } from 'next/router';
import LogoIcon from '@/icons/LogoIcon';
import ContactIcon from '@/icons/ContactIcon';
import FeedbackIcon from '@/icons/FeedbackIcon';
import GlobalIcon from '@/icons/GlobalIcon';

export default function Sidebar({ isMobile }: { isMobile: boolean }): JSX.Element {
  const [open, setOpen] = useState(!isMobile);
  const [display, setDisplay] = useState(true);
  const hiddenRoutes = useMemo(() => ['/app/plans'], []);
  const router = useRouter();
  useEffect(() => setOpen(!isMobile), [isMobile]);

  useEffect(() => {
    setDisplay(!hiddenRoutes.reduce((acc, cur) => acc && router.pathname.startsWith(cur), true));
  }, [hiddenRoutes, router.pathname]);

  if (!display) return <></>;

  const sidebarItems = [
    {
      url: '/app/home',
      label: 'Dashboard',
      Icon: HomeIcon,
    },
    {
      url: '/app/profile',
      label: 'Profile',
      Icon: ProfileIcon,
    },
    {
      url: 'https://discord.gg/K5B727vEnV',
      label: 'Contact Support',
      Icon: ContactIcon,
    },
    {
      url: 'https://airtable.com/shrFg9MPi9BGguwPU',
      label: 'Feedback Form',
      Icon: FeedbackIcon,
    },
    {
      url: 'https://discord.gg/anrh9B2Z3w',
      label: 'Join Our Discord',
      Icon: GlobalIcon,
    },
  ];

  return (
    <>
      <div
        className={`${
          open ? 'w-[288px] shrink-0' : 'w-auto'
        } flex h-screen max-h-screen flex-col border-r-[1px] border-r-[#e0e0e0] bg-white  transition-all`}
      >
        {!isMobile && (
          <div className="relative mt-6 mb-[70px] flex h-fit w-full items-center justify-center">
            {open && <LogoIcon />}
            <ChevronIcon
              onClick={() => setOpen(!open)}
              className={` h-4 w-4 cursor-pointer ${
                !open ? '' : 'absolute right-5 top-0 rotate-180'
              }`}
              strokeWidth={2.5}
            />
          </div>
        )}
        <ul className="flex flex-col gap-y-[25px]">
          {sidebarItems.map(({ url, label, Icon }, i) => (
            <Link key={url + i} href={url}>
              <li
                className={`${
                  router.pathname === url && 'rounded-lg bg-primary font-medium text-white'
                } mx-4 flex cursor-pointer items-center gap-6 rounded-md px-4 py-2 hover:rounded-lg hover:bg-primary hover:text-white`}
              >
                <div className="flex h-full w-6 items-center justify-center">
                  <Icon className="h-6 w-6" />
                </div>
                {open && <span className="text-[18px] ">{label}</span>}
              </li>
            </Link>
          ))}
        </ul>
        <div className="flex-grow"></div>

        <button
          className="mx-4 flex  items-center gap-6 px-5 pb-5 align-bottom"
          onClick={() => signOut()}
        >
          <LogoutIcon className="h-6 w-6" />
          {open && <span className="text-[18px]">Log Out</span>}
        </button>
      </div>
    </>
  );
}
