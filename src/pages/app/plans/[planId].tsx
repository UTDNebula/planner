import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next/types';
import { getServerSession } from 'next-auth';
import superjson from 'superjson';

import Planner from '@/components/planner/Planner';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { createContextInner } from '@/server/trpc/context';
import { appRouter } from '@/server/trpc/router/_app';
import usePlan from '@/components/planner/usePlan';
import { SemestersContextProvider } from '@/components/planner/SemesterContext';
import { Steps } from 'intro.js-react';

/**
 * A page that displays the details of a specific student academic plan.
 */
export default function PlanDetailPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
): JSX.Element {
  const { planId } = props;

  const { plan, validation, bypasses, isPlanLoading, handlePlanDelete } = usePlan({ planId });

  // Indicate UI loading
  if (isPlanLoading) {
    return <div>Loading</div>;
  }

  const steps = [
    {
      element: '#hello',
      intro: 'Hello step',
    },
    {
      element: '#world',
      intro: 'World step',
    },
  ];

  return (
    <div className="flex h-screen max-h-screen w-screen flex-col overflow-hidden">
      {plan && (
        <SemestersContextProvider planId={planId} plan={plan} bypasses={bypasses ?? []}>
          {/* <Steps enabled={true} steps={steps} initialStep={0} onExit={() => console.log('HI')} /> */}
          <Planner degreeRequirements={validation} transferCredits={plan.transferCredits} />
        </SemestersContextProvider>
      )}
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext<{ planId: string }>) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({ session }),
    transformer: superjson,
  });

  const planId = context.params?.planId as string;

  // await ssg.courses.publicGetSanitizedCourses.prefetch();
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
