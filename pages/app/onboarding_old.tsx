import { Button, Link, TextField } from '@material-ui/core';
import Head from 'next/head';
import React from 'react';
import Disclaimer from '../../components/onboarding/Disclaimer';
import { useAuthContext } from '../../modules/auth/auth-context';
import { HonorsIndicator } from '../../modules/common/types';

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

  // TODO: Find better way to structure this glorified form.
  return (
    <div className="h-full w-full py-8">
      <Head>
        <title>Nebula - Getting Started</title>
        <meta
          name="description"
          content="Getting started wtih Nebula. Onboarding to set up your experience."
        />
      </Head>
      <section className="">
        <div className="max-w-4xl mx-auto p-8 bg-white">
          <div className="text-headline4 pt-4 pb-2">Before we start...</div>
          <Disclaimer onConsent={setConsentData} />
        </div>
      </section>
      {consentData.disclaimer && (
        <>
          <section className="max-w-4xl mx-auto p-8">
            <div className="text-headline4 font-bold mb-4">Tell us about yourself.</div>
            <TextField
              id="studentName"
              label="Preferred name"
              variant="filled"
              value={data.preferredName}
              onChange={handleChange}
            />
            <div className="text-headline6 font-bold mt-4 mb-4">
              Are you recieving financial student aid?
            </div>
            <div className="text-headline6 font-bold mb-4">
              Are you recieving any school-provided scholarships?
            </div>
          </section>
          <section className="max-w-4xl mx-auto p-8">
            <div className="text-headline4 font-bold mb-4">What are you studying?</div>
          </section>
          <section className="max-w-4xl mx-auto p-8">
            <div className="text-headline4 font-bold mb-4">
              What would you like to do after graduation?
            </div>
          </section>
          <section className="max-w-4xl mx-auto p-8">
            <div className="text-headline4 font-bold mb-4">
              Are you a part of any special honors programs?
            </div>
          </section>
          <section className="max-w-4xl mx-auto p-8">
            <div className="text-headline4 font-bold mb-4">
              What would you like to do during your time at UTD?
            </div>
          </section>
          <section className="max-w-4xl mx-auto p-8">
            <Button color="primary" variant="contained" onClick={handleSubmit}>
              <Link href={onboardingRedirect}>Generate plan</Link>
            </Button>
          </section>
        </>
      )}
    </div>
  );
}
