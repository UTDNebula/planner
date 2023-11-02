import { createServerSideHelpers } from '@trpc/react-query/server';
import Cookies from 'cookies';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import superjson from 'superjson';

import { env } from '@/env/client.mjs';
import { appRouter } from '@/server/trpc/router/_app';
import { createContextInner } from '@server/trpc/context';
import { seedTestUser } from 'prisma/seedTestUser';

import Home from '../../components/home/Home';
import { prisma } from '../../server/db/client';
import { authOptions } from '../api/auth/[...nextauth]';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  let serverSession = await getServerSession(context.req, context.res, authOptions);
  if (!serverSession && env.NEXT_PUBLIC_NODE_ENV === 'development') {
    // bypass login using test user for convenience
    const { user, session } = await seedTestUser(prisma);
    serverSession = {
      user: {
        id: session.userId,
        email: user.email,
      },
      expires: new Date(session.expires).toISOString(),
    };
    const cookies = new Cookies(context.req, context.res);
    cookies.set('next-auth.session-token', session.sessionToken, {
      domain: 'localhost',
      // session is not actually a 'Date' object here, it's a string
      expires: new Date(session.expires),
      httpOnly: true,
      path: '/',
      secure: false,
    });
  }
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: await createContextInner({ session: serverSession }),
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
