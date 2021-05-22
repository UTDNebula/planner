import React from 'react';
import AnnouncementItem, { Notice } from './AnnouncementItem';

/**
 * Component properties for a NoticeList.
 */
interface NoticeListProps {
  notices: Notice[];
}

/**
 * A list of notices for the user.
 */
export default function NoticeList({ notices }: NoticeListProps): JSX.Element {
  const isEmpty = notices.length === 0;

  const noticeItems = notices.map((notice, index) => {
    return <AnnouncementItem key={`${notice.title}-${index}`} {...notice} />;
  });

  return (
    <div>
      <div>{noticeItems}</div>
      {isEmpty && <div className="align-center text-subtitle1 font-bold">No announcements!</div>}
    </div>
  );
}
