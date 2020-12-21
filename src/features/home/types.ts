/**
 * An announcement or suggestion displayed to a user.
 */
export interface Notice {
  /**
   * A description for this notice.
   */
  title: string;

  /**
   * An action associated with this notice.
   */
  action?: {
    /**
     * A description for this action.
     */
    text: string;
    /**
     * A link that serves as a destination for a call to action.
     */
    link: string;
  };
}

/**
 * An indicator that associates a student with one or more honors programs.
 */
export type HonorsIndicator =
  /**
   * Collegium V Honors
   */
  'cv' |

  /**
   * Computer Science Scholar
   */
  'cs2' |

  /**
   * Liberal Arts Honors  
   */
  'lahc' |

  /**
   * Behavioral and Brain Sciences Honors
   */
  'bbs' |

  /**
   * Arts and Humanities Honors
   */
  'ah' |

  /**
   * Economic, Political & Policy Sciences Honors
   */
  'epps' |

  /**
   * Natural Sciences and Mathematics Honors
   */
  'nsm' |

  /**
   * Arts & Technology Honors
   */
  'atec' |

  /**
   * Interdisciplinary Studies Honors
   */
  'is';

/**
 * A degree plan descriptor.
 */
export interface PlanInfo {
  type: 'BS' | 'BA' | 'MS' | 'MFA' | 'PhD' | 'AuD';
  title: string;
}

/**
 * Useful information about a student's academic career.
 */
export interface StudentDetails {

  /**
   * The name of the student.
   */
  name: string;

  /**
   * Data for the student's currently chosen selected degree plan.
   */
  planInfo: PlanInfo;

  /**
   * An indicator for association with an honors program.
   */
  honorsIndicators: HonorsIndicator[];

  /**
   * The semester code when a student joined the university.
   */
  enrolled: string;

  /**
   * The semester when a student is expected to graduate based on calculated
   * course info.
   */
  estimatedGraduation: string;

  /**
   * The number of courses for which a student has obtained credit.
   */
  coursesCompleted: number;

  /**
   * The total number of credit hours a student has attempted, including
   * all courses for which a grade was recieved and withdrawn courses but not
   * courses through which credit was awarded by examination.
   */
  attemptedHours: number;

  /**
   * The number of courses remaining on a degree plan before being eligible for
   * graduation.
   */
  coursesRemaining: number;

  /**
   * A student's grade point average.
   */
  gpa: number;
}
