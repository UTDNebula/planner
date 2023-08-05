import { createServerSideHelpers } from '@trpc/react-query/server';
import { Steps } from 'intro.js-react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next/types';
import { getServerSession } from 'next-auth';
import { useEffect, useState } from 'react';
import superjson from 'superjson';

import Planner from '@/components/planner/Planner';
import { SemestersContextProvider } from '@/components/planner/SemesterContext';
import usePlan from '@/components/planner/usePlan';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { createContextInner } from '@/server/trpc/context';
import { appRouter } from '@/server/trpc/router/_app';
import { trpc } from '@/utils/trpc';

/**
 * A page that displays the details of a specific student academic plan.
 */
export default function PlanDetailPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
): JSX.Element {
  const { planId } = props;

  const {
    plan,
    validation,
    degreeRequirements: degreeRequirementsData,
    bypasses,
    isPlanLoading,
  } = usePlan({ planId });

  const { data: userData, isLoading } = trpc.user.getUser.useQuery(undefined, {
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const steps = [
    {
      intro: (
        <div className="">
          This is the Plan Editor. The Plan Editor allows you to search for and add individual
          courses to your plan by semester.
        </div>
      ),
    },
    {
      element: '#tutorial-editor-1',
      intro: (
        <div className="">
          Search for courses and track required classes for your degree plan here. Drag courses from
          each major requirement tab into your plan to start organizing.
        </div>
      ),
    },
    {
      element: '#tutorial-editor-2',
      intro: (
        <div className="">
          The degree progress bar displays completed hours and remaining required classes for your
          degree plan.
        </div>
      ),
    },
    {
      element: '.tutorial-editor-3',
      intro: (
        <div className="">
          Drag courses to each semester tab to plan your degree. Click the ellipsis for options to
          clear, lock, select all courses, or color code a specific semester.
        </div>
      ),
    },
    {
      element: '#tutorial-editor-4',
      intro: (
        <div className="">
          This is where you can edit your plan name and change your major degree plan.
        </div>
      ),
    },
    {
      element: '#tutorial-editor-5',
      intro: (
        <div className="">
          This is where you can edit your semesters by adding or removing semesters year. You can
          also delete the plan here.
        </div>
      ),
    },
    {
      element: '#tutorial-editor-6',
      intro: (
        <div className="">
          This is where you can edit your semesters by adding or removing semesters year. You can
          also delete the plan here.
        </div>
      ),
    },
    {
      element: '#tutorial-editor-7',
      intro: <div className="">Click here to export your degree plan into PDF format.</div>,
    },
  ];

  // This exists so that the <Steps> component properly renders
  // See https://stackoverflow.com/questions/73278824/in-intro-js-and-intro-js-react-the-first-step-appears-twice

  const [help, setHelp] = useState(false);
  useEffect(() => {
    setHelp(true);
  }, [help]);

  const utils = trpc.useContext();

  const updateSeenPlanOnboarding = trpc.user.seenPlanOnboarding.useMutation({
    async onSuccess() {
      await utils.user.getUser.invalidate();
    },
  });

  const [showPlanOnboardingModal, setShowPlanOnboardingModal] = useState(false);
  useEffect(() => {
    setShowPlanOnboardingModal((userData && !userData.seenPlanOnboardingModal) ?? false);
  }, [userData, isLoading]);

  const handleClosePlanOnboarding = () => {
    setShowPlanOnboardingModal(false);
    updateSeenPlanOnboarding.mutateAsync();
  };

  // Indicate UI loading
  if (isPlanLoading) {
    return (
      <div className="h-screen w-screen text-2xl">Your plan is loading....please sit tight :)</div>
    );
  }

  return (
    <>
      <Steps
        enabled={help && showPlanOnboardingModal}
        steps={steps}
        initialStep={0}
        onExit={handleClosePlanOnboarding}
        options={{ doneLabel: 'Done', showStepNumbers: true }}
      />
      <div className="flex h-screen max-h-screen w-screen flex-col overflow-hidden">
        {plan && (
          <SemestersContextProvider planId={planId} plan={plan} bypasses={bypasses ?? []}>
            <Planner
              degreeRequirements={validation}
              degreeRequirementsData={
                degreeRequirementsData ?? { id: 'loading', major: 'undecided' }
              }
              transferCredits={plan.transferCredits}
            />
          </SemestersContextProvider>
        )}
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext<{ planId: string }>) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: await createContextInner({ session }),
    transformer: superjson,
  });

  const planId = context.params?.planId as string;

  await Promise.all([
    ssg.validator.prereqValidator.prefetch(planId),
    ssg.validator.degreeValidator.prefetch(planId),
    ssg.plan.getPlanById.prefetch(planId),
    ssg.plan.getDegreeRequirements.prefetch({ planId }),
  ]);

  return {
    props: {
      trpcState: ssg.dehydrate(),
      planId,
    },
  };
}

PlanDetailPage.auth = true;
