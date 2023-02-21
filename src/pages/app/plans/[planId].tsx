import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next/types';
import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import superjson from 'superjson';

import Planner from '@/components/planner/Planner';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { createContextInner } from '@/server/trpc/context';
import { appRouter } from '@/server/trpc/router/_app';
import usePlan from '@/components/planner/usePlan';
import { SemestersContextProvider } from '@/components/planner/SemesterContext';

/**
 * A page that displays the details of a specific student academic plan.
 * TODO: Make context if we prop drill 3+ prop values
 */
export default function PlanDetailPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
): JSX.Element {
  const { planId } = props;
  const { plan, validation, isLoading, handlePlanDelete } = usePlan({ planId });

  // Indicate UI loading
  if (isLoading) {
    return <div>Loading</div>;
  }

  return (
    <div className="flex h-screen max-h-screen w-screen flex-col overflow-hidden overflow-y-scroll">
      {plan && validation && (
        <SemestersContextProvider planId={planId} plan={plan}>
          <Planner degreeRequirements={validation} />
        </SemestersContextProvider>
      )}
      <button onClick={handlePlanDelete}>Delete</button>
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

  await ssg.plan.getPlanById.prefetch(planId);
  return {
    props: {
      trpcState: ssg.dehydrate(),
      planId,
    },
  };
}

PlanDetailPage.auth = true;
