import { createContextInner } from '@server/trpc/context';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import * as React from 'react';
import superjson from 'superjson';

import ProfilePage from '@/components/home/Profile';
import { appRouter } from '@/server/trpc/router/_app';

import useMedia from '../../utils/media';
import { authOptions } from '../api/auth/[...nextauth]';
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({ session }),
    transformer: superjson,
  });

  await ssg.plan.getUserPlans.prefetch();
  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
}
export default function MiniDrawer() {
  const isDesktop = useMedia('(min-width: 900px)');

  return <ProfilePage isDesktop={true} />;
}

MiniDrawer.auth = true;
