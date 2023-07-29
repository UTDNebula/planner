import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { GetServerSidePropsContext } from 'next';
import dynamic from 'next/dynamic';
import { getServerSession } from 'next-auth';
import * as React from 'react';
import superjson from 'superjson';

// import Credits from '@/components/home/Credits';
import { appRouter } from '@/server/trpc/router/_app';
import { createContextInner } from '@server/trpc/context';

import { authOptions } from '../api/auth/[...nextauth]';
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({ session }),
    transformer: superjson,
  });

  await ssg.plan.getUserPlans.prefetch();
  await ssg.user.getUser.prefetch();
  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
}
export default function MiniDrawer() {
  const Credits = dynamic(() => import('@/components/home/Credits'), { ssr: false });

  return <Credits />;
}

MiniDrawer.auth = true;
