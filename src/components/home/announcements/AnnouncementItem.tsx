import React from 'react';

export type NoticeAction = {
  link: string;
  actionText: string;
};

export type Notice = {
  title: string;
  description: string;
  action: NoticeAction;
  issueDate: Date;
};

/**
 * Component properties for a AnnouncementItem.
 */
interface AnnouncementItemProps {
  title: string;
  description: string;
  action: NoticeAction;
}

/**
 * An action item or notice for the user.
 */
export default function AnnouncementItem({
  title,
  description,
  action,
}: AnnouncementItemProps): JSX.Element {
  return (
    <div className="py-2">
      <span className="block text-subtitle1 font-bold text-blue-700">{title}</span>
      <span className="block my-1 text-subtitle2">{description}</span>
      {action && (
        <a
          className="block mt-1 text-caption font-bold hover:underline text-blue-500"
          href={action.link}
        >
          &gt; {action.actionText}
        </a>
      )}
    </div>
  );
}
