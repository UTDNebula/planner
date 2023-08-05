import { createServerSideHelpers } from '@trpc/react-query/server';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import superjson from 'superjson';

import { appRouter } from '@/server/trpc/router/_app';
import { createContextInner } from '@server/trpc/context';

import Home from '../../components/home/Home';
import { authOptions } from '../api/auth/[...nextauth]';
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: await createContextInner({ session }),
    transformer: superjson,
  });

  await Promise.all([ssg.user.getUser.prefetch(), ssg.plan.getUserPlans.prefetch()]);

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
}
export default function MiniDrawer() {
  return <Home />;
}

MiniDrawer.auth = true;
