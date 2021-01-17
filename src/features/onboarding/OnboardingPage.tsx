import React from 'react';
import Disclaimer from '../../components/onboarding/Disclaimer';
import { useAuthContext } from '../auth/auth-context';
import { HonorsIndicator } from '../home/types';

/**
 * A goal to pursue after graduation.
 */
type CareerGoal =
  /**
   * Law school or some legal profession.
   */
  | 'LAW_SCHOOL'
  /**
   * Medical school or some medical profession.
   */
  | 'MED_SCHOOL'
  /**
   * Indicates more a long-term career in research, stopping at a PhD.
   */
  | 'RESEARCH'
  /**
   * Graduate school, either Master's or undecided PhD.
   */
  | 'GRAD_SCHOOL'
  | 'BUSINESS'
  /**
   * Generic catch-all for anything that really only uses college as a bloated credential.
   */
  | 'CAREER'
  | 'ENTREPRENEURSHIP'
  | 'UNDECIDED';

/**
 * Attributes/flags attached to a student used to further customize the service.
 */
type StudentAttributes = {
  /**
   * True if the student is currently living on campus.
   */
  onCampus: boolean;

  /**
   * True if a student is entering college right out of high school
   */
  traditional: boolean;

  /**
   * True if the student is recieving any financial aid.
   */
  receivingAid: boolean;
};

/**
 * The scholarhip program the student is a part of.
 */
type ScholarshipType = 'MCDERMOTT' | 'TERRY' | 'NATIONAL_MERIT' | 'DIVERSITY' | 'AES' | 'NONE';

type PrestigeAttributes = {
  honors: HonorsIndicator;
  scholarship: ScholarshipType;
};

/**
 * Academic programs that have extraordinarily special rules when
 * validating plans.
 */
type SpecialPrograms = {
  /**
   *
   * TODO: Do not hardcode this.
   */
  fastTrack: boolean;
};

/**
 * Information used to generate an initial four year plan.
 */
type PlanData = {
  // TODO: Seamlessly support graduate student plans
  /**
   * A list of major (CoursePlan) IDs.
   */
  majors: string[];

  /**
   * A list of minor (CoursePlan) IDs.
   */
  minors: string[];

  /**
   * Flags for any special planning modifiers.
   */
  programs: SpecialPrograms;
};

/**
 * Information obtained during onboarding.
 */
type OnboardingFormData = {
  /**
   * A name used for personalization, may be different from authenticated user name.
   */
  preferredName: string;

  /**
   * A long-term career path.
   */
  goal: CareerGoal;

  /**
   * Metadata used to geenrate an initial customized StudentPlan.
   */
  plan: PlanData;

  /**
   * Attributes for a student's situation in life.
   */
  studentAttributes: StudentAttributes;

  /**
   * Flags for special academic/scholarship programs a student is a part of.
   */
  prestige: PrestigeAttributes;
};

/**
 * A hook that tracks user configuration information.
 *
 * @param studentDefaultName A personalized name to prepopulate the name field.
 */
function useUserSetup(studentDefaultName = 'Comet') {
  const [consentData, setConsentData] = React.useState({
    disclaimer: false,
    personalization: false,
    analytics: false,
    performance: false,
  }); // TODO: Reduce redundancy
  const [data, setData] = React.useState<OnboardingFormData>({
    preferredName: studentDefaultName,
    goal: 'UNDECIDED',
    plan: {
      majors: [],
      minors: [],
      programs: {
        fastTrack: false,
      },
    },
    studentAttributes: {
      onCampus: false,
      traditional: false,
      receivingAid: false,
    },

    /**
     * Flags for special academic/scholarship programs a student is a part of.
     */
    prestige: {
      honors: 'none',
      scholarship: 'NONE',
    },
  });

  const setScholarship = (scholarship: ScholarshipType) => {
    console.log('Selecting scholarship: ', scholarship);
  };

  return {
    data,
    consentData,
    setConsentData,
    setScholarship,
  };
}

/**
 * A page to configure first-time set-up for user preferences.
 *
 * TODO: Support anonymous setup.
 */
export default function OnboardingPage(): JSX.Element {
  const { user } = useAuthContext();
  const { data, consentData, setConsentData } = useUserSetup();

  if (user === null) {
    // TODO: Do something useful
  }

  return (
    <div className="h-full w-full">
      <section className="container">
        <Disclaimer onConsent={setConsentData} />
      </section>
      {consentData && (
        <section>
          <div className="text-headline-4">Tell us about yourself.</div>
        </section>
      )}
    </div>
  );
}
