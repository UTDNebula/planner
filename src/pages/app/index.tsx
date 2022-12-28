import { useRouter } from 'next/router';
import superjson from 'superjson';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';

import { createContextInner } from '@server/trpc/context';
import { appRouter } from '@/server/trpc/router/_app';
import { trpc } from '@utils/trpc';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
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
export default function MiniDrawer() {
  const router = useRouter();
  const userQuery = trpc.user.getUser.useQuery();
  const { data } = userQuery;
  console.table(data);
  if (data && !data.onboardingComplete) {
    router.push('/app/onboarding');
    return;
  }

  router.push('/app/home');
}
MiniDrawer.auth = true;
