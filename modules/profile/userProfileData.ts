import React from "react";

/**
 * Data access from a student's profile.
 */
type UserProfileHandle = {
  /**
   * Data about the user.
   */
  userInfo: {
    /**
     * A first name used to address the user.
     */
    preferredName: string;
  };

  /**
   * Information specifically used for Nebula Web.
   */
  serviceInfo: {
    /**
     * True if the user has been introduced to the service and has initialized
     * their state.
     */
    onboarded: boolean;
  };
};

/**
 * A hook that exposes profile data
 *
 * @param userId The UID of the user whose data to fetch
 */
export function useUserProfileData(userId: string): UserProfileHandle {
  // TODO: Check for authorization and if userId is actually valid for device

  return React.useMemo(() => {
    return {
      userInfo: {
        preferredName: "Student",
      },
      serviceInfo: {
        onboarded: false,
      },
    };
  }, [userId]);
}

/**
 * High-level statistics for a degree plan.
 */
type UserSummary = {
  /**
   * The number of courses a user has taken.
   */
  coursesTaken: number;

  /**
   * The number of unfulfilled courses required to complete the active degree plan.
   */
  coursesRemaining: number;

  /**
   * The number of attempted credit hours as determined by the University registrar.
   */
  hoursAttempted: number;

  /**
   * The user's current GPA.
   */
  gpa: number;

  /**
   * A year + semester for the estimated graduation date of the student.
   */
  estimatedGraduation: string;
};

/**
 * Returns easily consumable summary statistics and information for the given user.
 *
 * @param userId The ID of the user to retrieve data
 */
export function useUserSummaryStatistics(/* userId: string */): UserSummary {
  return {
    coursesTaken: 0,
    coursesRemaining: 0,
    hoursAttempted: 0,
    gpa: 0,
    estimatedGraduation: "2023s",
  };
}
