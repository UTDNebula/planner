import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { type RouterInputs } from '@utils/trpc';
import { GetServerSidePropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';
import { unstable_getServerSession } from 'next-auth/next';
import React, { useEffect, useState } from 'react';
import superjson from 'superjson';

import { createContextInner } from '@/server/trpc/context';
import { appRouter } from '@/server/trpc/router/_app';
import { trpc } from '@/utils/trpc';

import Disclaimer from '../../components/onboarding/Onboarding_Pages/disclaimer';
import PageOne, { PageOneTypes } from '../../components/onboarding/Onboarding_Pages/pg_1';
import PageTwo, { PageTwoTypes } from '../../components/onboarding/Onboarding_Pages/pg_2';
import Privacy from '../../components/onboarding/Onboarding_Pages/privacy';
import Welcome from '../../components/onboarding/Onboarding_Pages/welcome';
import { HonorsIndicator } from '../../modules/common/types';
import { authOptions } from '../api/auth/[...nextauth]';

/**
 * The first onboarding page for the application.
 *
 * This will help students set up nebula according to their needs.
 */

/**
 * A goal to pursue after graduation.
 */
export type CareerGoal =
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

type FastTrackType = {
  status: boolean;
  major: string;
  year: string;
};

type PrestigeAttributes = {
  honors: HonorsIndicator[];
  scholarship: string; // ScholarshipType;
  fastTrack: FastTrackType;
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

  // /**
  //  * Flags for any special planning modifiers.
  //  */
  // programs: SpecialPrograms;
};

type ConsentData = {
  disclaimer: boolean;
  personalization: boolean;
  analytics: boolean;
  performance: boolean;
};

/**
 * Information obtained during onboarding.
 */
export type OnboardingFormData = {
  /**
   * Store user consent data
   */

  consent: ConsentData;
  /**
   * A name used for personalization, may be different from authenticated user name.
   */
  preferredName: string;

  /**
   * A student's current grade by credits
   */

  classification: string;

  /**
   * A long-term career path.
   */
  future: string; //CareerGoal;

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
export function useUserSetup(studentDefaultName = 'Comet') {
  // TODO: Check if user already exists; if true, use user values
  const [consentData, setConsentData] = React.useState({
    disclaimer: false,
    personalization: true,
    analytics: true,
    performance: true,
  });
  const [pageOneData, setPageOneData] = useState<PageOneTypes>({
    name: '',
    classification: '',
    degree: [
      {
        degree: '',
        degreeType: '',
        valid: false,
      },
    ],
    future: '',
  });

  const [pageTwoData, setPageTwoData] = useState<PageTwoTypes>({
    scholarship: false,
    scholarshipType: '',
    receivingAid: false,
    fastTrack: false,
    fastTrackMajor: '',
    fastTrackYear: '',
    honors: [],
  });

  const [pageThreeData, setPageThreeData] = useState({
    creditState: [],
  });

  return {
    pageOneData,
    setPageOneData,
    pageTwoData,
    setPageTwoData,
    pageThreeData,
    setPageThreeData,
    consentData,
    setConsentData,
  };
}

/**
 * A page to configure first-time set-up for user preferences.
 *
 * TODO: Support anonymous setup.
 */
export default function OnboardingPage() {
  // const { user } = useAuthContext();
  const {
    pageOneData,
    setPageOneData,
    pageTwoData,
    setPageTwoData,
    pageThreeData,
    setPageThreeData,
    consentData,
    setConsentData,
  } = useUserSetup();
  const utils = trpc.useContext();
  // const userQuery = trpc.user.getUser.useQuery();
  // const { data } = userQuery;

  const addProfile = trpc.user.updateUserOnboard.useMutation({
    async onSuccess() {
      await utils.user.getUser.invalidate();
    },
  });

  const [page, setPage] = useState(0);
  const [validate, setValidate] = useState([true, false, true, false, false, true]);

  // const dispatch = useDispatch();

  const [validNextPage, setValidNextPage] = useState(false);

  const [navProps, setNavProps] = useState<any>({
    personal: true,
    honors: false,
    credits: false,
  });

  const router = useRouter();

  // TODO: Find cleaner way to do this
  const setNavigationProps = (page: number) => {
    switch (page) {
      case 3:
        setNavProps({ personal: true, honors: false, credits: false });
        break;
      case 4:
        setNavProps({ personal: false, honors: true, credits: false });
        break;
      case 5:
        setNavProps({ personal: false, honors: false, credits: true });
        break;
    }
  };

  const validateForm = (value: boolean) => {
    const temp = validate;
    temp[page] = value;
    setValidate(temp);
  };

  function generateRedirect({ plan, prestige }: OnboardingFormData): string {
    const coursePlans = plan.majors.concat(plan.minors).join('&');
    return `?coursePlans=${coursePlans}&fastTrack=${prestige.fastTrack}`;
  }

  // const { updateName } = useAuthContext();

  const handleSubmit = async () => {
    const data = organizeOnboardingData();
    // TODO: Send data to firebase if creating account
    console.log('Send data to firebase & go to /app', data);
    // updateName(data.preferredName);
    // flogi
    const input: RouterInputs['user']['updateUserOnboard'] = {
      name: data.preferredName,
      majors: data.plan.majors,
    };

    try {
      await addProfile.mutateAsync(input);
    } catch (error) {}

    // TODO: Figure out functionality for guest users

    // const onboardingRedirect = `/app/routes/route`;

    // Mark onboarding done
    // dispatch(updateOnboarding(data));

    router.push('/app/home');
  };

  const organizeOnboardingData = () => {
    const plan = degreeToPlan();
    const studentAttributes = {
      onCampus: false,
      traditional: false,
      receivingAid: pageTwoData.receivingAid,
    };
    const prestige: PrestigeAttributes = {
      honors: pageTwoData.honors,
      scholarship: pageTwoData.scholarshipType,
      fastTrack: {
        status: pageTwoData.fastTrack,
        major: pageTwoData.fastTrackMajor,
        year: pageTwoData.fastTrackYear,
      },
    };
    const data: OnboardingFormData = {
      consent: consentData,
      preferredName: pageOneData.name,
      classification: pageOneData.classification,
      future: pageOneData.future,
      plan: plan,
      studentAttributes: studentAttributes,
      prestige: prestige,
    };
    return data;
  };

  const degreeToPlan = () => {
    // Create new PlanData variable
    const temp = {
      majors: [] as string[],
      minors: [] as string[],
    };
    pageOneData.degree.forEach((value) => {
      if (value.degreeType === 'major') {
        temp.majors.push(value.degree);
      } else {
        temp.minors.push(value.degree);
      }
    });
    return temp;
  };

  const jsxElem = [
    <Welcome key={0} />,
    <Disclaimer
      props={{ ...consentData }}
      handleChange={setConsentData}
      key={1}
      handleValidate={validateForm}
    />,
    <Privacy props={{ ...consentData }} handleChange={setConsentData} key={2} />,
    <PageOne
      key={3}
      handleChange={setPageOneData}
      props={{ ...pageOneData }}
      handleValidate={validateForm}
    ></PageOne>,
    <PageTwo
      key={4}
      handleChange={setPageTwoData}
      props={{ ...pageTwoData }}
      handleValidate={validateForm}
    ></PageTwo>,
  ];
  const incrementPage = () => {
    setNavigationProps(page + 1);
    if (page + 1 < 4) {
      setPage(Math.min(page + 1, jsxElem.length - 1));
    } else {
      handleSubmit();
    }
  };
  const decrementPage = () => {
    setNavigationProps(page - 1);
    setPage(Math.max(page - 1, 0));
  };

  // const changePage = (page: number) => {
  //   setNavigationProps(page);
  //   setPage(page);
  // };

  useEffect(() => {
    console.log(pageTwoData);
    setValidNextPage(validate[page]);
  });

  // TODO: Find better way to structure this glorified form.
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-blue-400">
        <div className="w-full h-screen flex justify-center items-center p-5 transition-all sm:h-auto sm:my-16 sm:py-16 sm:px-32 sm:w-3/4 rounded shadow-2xl bg-white">
          <div className="flex flex-col items-center justify-center">
            {/* {page >= 3 && (
              <Navigation
                navigationProps={navProps}
                currentPage={page}
                validate={validate}
                changePage={changePage}
              />
            )} */}
            {jsxElem[page]}
            <div className="justify-start">
              <button
                onClick={decrementPage}
                disabled={page == 0}
                className="mr-10 text-blue-500 hover:text-yellow-500 font-bold rounded disabled:opacity-50"
              >
                BACK
              </button>
              <button
                onClick={incrementPage}
                disabled={!validNextPage}
                className="text-blue-500 hover:text-yellow-500 font-bold rounded disabled:opacity-50"
              >
                NEXT
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({ session }),
    transformer: superjson,
  });

  await ssg.user.getUser.prefetch();
  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
}
