import { Notice } from '../../../nebula-web/components/home/announcements/AnnouncementItem';

/**
 * A hook used to access service notices for the current user.
 *
 * Must be used by a component inside an AuthContext.
 */
export default function useUserNotices(): UserNoticesReturnType {
  const filter = (/* date: string */) => {
    return [];
  };

  return {
    notices: [],
    filter: filter,
  };
}

type UserNoticesReturnType = {
  /**
   * A list of all noices for the user.
   */
  notices: Notice[];

  /**
   * Filter notices by the given parameters.
   *
   * @param date The maximum date for the returned notices
   * @param source Where the notice was provided from
   */
  filter: (date: string, source?: string) => Notice[];
};
