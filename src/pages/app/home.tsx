import { createContextInner } from '@server/trpc/context';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { GetServerSidePropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth';
import * as React from 'react';
import superjson from 'superjson';

import { appRouter } from '@/server/trpc/router/_app';

import Home from '../../components/newhome/Home';
import HomeDrawer from '../../components/newhome/HomeDrawer';
import useMedia from '../../modules/common/media';
import { authOptions } from '../api/auth/[...nextauth]';
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);
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

  return (
    <>
      <HomeDrawer isDesktop={isDesktop} />
      <Home key={0} />
    </>
  );
}

MiniDrawer.auth = true;
