import React from 'react';

/**
 * Metadata for action to be taken for a Notice.
 */
export type NoticeAction = {
  /**
   * Call-to-action text informing the user what to do.
   *
   * @example "Schedule appointment with academic advisor"
   */
  actionText: string;

  /**
   * A call-to-action link related to this action.
   */
  link: string;
};

/**
 * Where a notice came from.
 *
 * - A 'service' source indicates a notice came from a service administrator.
 * - An 'app' source indicates a notice came from the client based on some
 *  automated or user-triggered functionality.
 */
export type NoticeSource = 'service' | 'app';

/**
 * An announcement for the user.
 */
export type Notice = {
  /**
   * A brief announcement title.
   */
  title: string;

  /**
   * A 1-3 sentence description containing information for this notice.
   */
  description: string;

  /**
   * A call to action.
   */
  action: NoticeAction;

  /**
   * When this notice was sent to the user.
   */
  issueDate: Date;

  /**
   * The issuer of the source
   */
  source: NoticeSource;
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
