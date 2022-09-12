import React from 'react';

import { useAuthContext } from '../../modules/auth/auth-context';
import { SEMESTER_CODE_MAPPINGS } from '../../modules/common/data';
import { convertSemesterToData } from '../../modules/common/data-utils';
import {
  useUserProfileData,
  useUserSummaryStatistics,
} from '../../modules/profile/userProfileData';

/**
 * A block of user information.
 *
 * User data is fetched from the AuthContext.
 */
export default function HomeUserInfo(): JSX.Element {
  const { user } = useAuthContext();
  const { userInfo } = useUserProfileData(user.id);
  const { coursesTaken, coursesRemaining, hoursAttempted, gpa, estimatedGraduation } =
    useUserSummaryStatistics(/*user.id */);

  const { preferredName } = userInfo;
  const subtitleText = 'Junior studying Computer Science';
  const distinguishmentText = 'A Computer Science Scholar';

  // TOOD: Fetch from user
  // const honorsIndicators: HonorsIndicator[] = [];

  // const honorsIndicatorText =
  //   honorsIndicators.length > 0
  //     ? honorsIndicators
  //         .reduce((acc, indicator, index) => {
  //           let result = acc.concat(`${indicator}`);
  //           if (index < honorsIndicators.length - 1) {
  //             result = result.concat(', ');
  //           }
  //           return result;
  //         }, 'A ')
  //         .concat(' scholar')
  //     : '';

  const { year, semester } = convertSemesterToData(estimatedGraduation);
  const graduationText = `${SEMESTER_CODE_MAPPINGS[semester]} ${year}`;

  return (
    <>
      <h1 className="text-headline5">{preferredName}</h1>
      <div className="text-subtitle1">{subtitleText}</div>
      <div className="text-caption">{distinguishmentText}</div>
      <div className="my-2 text-subtitle1 font-bold">Current GPA: {gpa.toFixed(3)}</div>
      <div className="my-2">
        <div className="text-body2">
          {coursesTaken}/{coursesRemaining} courses taken
        </div>
        <div className="text-body2">{hoursAttempted} credit hours attempted</div>
      </div>
      <div className="py-2">Estimated graduation: {graduationText}</div>
    </>
  );
}
