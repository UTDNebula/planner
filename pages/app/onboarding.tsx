import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { Button, Link, TextField } from '@material-ui/core';
import Head from 'next/head';
import React from 'react';
import Disclaimer from '../../components/onboarding/Disclaimer';
import { useAuthContext } from '../../modules/auth/auth-context';
import { HonorsIndicator } from '../../modules/common/types';
import PageOne from '../Onboarding_Pages/pg_1';
import PageTwo from '../Onboarding_Pages/pg_2';
import PageThree from '../Onboarding_Pages/pg_3';
// import PageFour from '../Onboarding_Pages/pg_4';

/**
 * The first onboarding page for the application.
 *
 * This will help students set up nebula according to their needs.
 */

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
    setData,
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
  const { data, setData, consentData, setConsentData } = useUserSetup();
  const [page, setPage] = React.useState(0);

  if (user === null) {
    // TODO: Do something useful
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      preferredName: event.currentTarget.value,
    });
  };

  function generateRedirect({ plan }: OnboardingFormData): string {
    // const modifiers = Object.entries(plan.programs).reduce((acc, (key, value)) => {
    //   acc += `${key}=${value}`;
    //   return acc;
    // }, '');
    const coursePlans = plan.majors.concat(plan.minors).join('&');
    return `?coursePlans=${coursePlans}&fastTrack=${plan.programs.fastTrack}`;
  }

  const onboardingRedirect = `/app/plans/new${generateRedirect(data)}`;

  const handleSubmit = () => {
    console.log('Saving user information from onboarding:', data);
  };

  const jsxElem = [
    <PageOne key={0}></PageOne>,
    <PageTwo key={1}></PageTwo>,
    <PageThree key={2}></PageThree>,
    // <PageFour key={3}></PageFour>,
  ];
  const incrementPage = () => {
    setPage(Math.min(page + 1, jsxElem.length - 1));
  };
  const decrementPage = () => {
    setPage(Math.max(page - 1, 0));
  };

  // TODO: Find better way to structure this glorified form.
  return (
    <>
      {jsxElem[page]}
      <div className="flex items-center justify-center bg-blue-400 -mt-20">
        <div className="bg-white  rounded shadow-2xl w-2/3 mb-10">
          <div className="flex items-center justify-center">
            <button
              onClick={decrementPage}
              className="mr-10 text-blue-500 hover:text-yellow-500 font-bold rounded"
            >
              BACK
            </button>
            <button
              onClick={incrementPage}
              className="text-blue-500 hover:text-yellow-500 font-bold rounded"
            >
              NEXT
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
