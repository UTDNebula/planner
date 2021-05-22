import {
  Notice,
  NoticeSource,
} from '../../nebula-web/components/home/announcements/AnnouncementItem';

const SAMPLE_NOTICES = [
  {
    title: 'Upcoming degree audit',
    description:
      'You are approaching 45 completed credit hours. Check your email for an email from your academic advisor.',
    action: {
      link: 'https://example.com',
      actionText: 'Email advisor',
    },
    issueDate: new Date(),
    source: 'app' as NoticeSource,
  },
  {
    title: 'Collegium V GPA warning',
    description:
      'By the end of your sophomore year, you need to have a 3.3 GPA. Make sure to keep up with your coursework.',
    action: {
      link: 'https://honors.utdallas.edu/cv/program-requirements',
      actionText: 'Email advisor',
    },
    issueDate: new Date(),
    source: 'app' as NoticeSource,
  },
];

/**
 * Generate a list of sample user notices.
 *
 * TODO: Fetch from remote source
 *
 * @returns A list of notices
 */
export async function fetchNotices(): Promise<Notice[]> {
  return SAMPLE_NOTICES;
}
