import React from 'react';
import { fetchNotices } from '../../../api/notices';
import { Notice } from './AnnouncementItem';
import NoticeList from './NoticeList';

/**
 * A hook to provide notices and announcements.
 */
function useNotices(): NoticeAnnouncementGroup {
  const [notices, setNotices] = React.useState<Notice[]>([]);

  React.useEffect(() => {
    fetchNotices().then(setNotices);
  });

  const refresh = () => {
    // TODO: Make observable
    console.log('Refresh to be implemented');
  };

  return {
    notices: notices,
    announcements: [],
    refresh,
  };
}

type NoticeAnnouncementGroup = {
  notices: Notice[];
  announcements: string[];
  refresh: () => void;
};

export function NoticeBlock(): JSX.Element {
  const { notices } = useNotices();

  return (
    <>
      <h1 className="text-headline5">Announcements &amp; Notices</h1>
      <NoticeList notices={notices} />
    </>
  );
}
