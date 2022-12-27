import { useRouter } from 'next/router';
import superjson from 'superjson';
import { createProxySSGHelpers } from '@trpc/react-query/ssg'

import { createContextInner } from '@server/trpc/context'
import useMedia from '../../modules/common/media';
import { appRouter } from '@/server/trpc/router/_app';
import { trpc } from '@utils/trpc'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { type RouterOutputs } from '@utils/trpc'
type userData = RouterOutputs['user']['getUser']
export async function getServerSideProps(
  context: GetServerSidePropsContext
) {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({ session: null }),
    transformer: superjson,
  })

  await ssg.user.getUser.prefetch();
  return {
    props: {
      trpcState: ssg.dehydrate(),
    }
  }
}
export default function MiniDrawer(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const userQuery = trpc.user.getUser.useQuery();
  const { data } = userQuery;
  console.table(data)
  const router = useRouter();
  if (data && !data.onboardingComplete) {
    router.push('/app/onboarding')
    return;
  }

  router.push('/app/home');
}
MiniDrawer.auth = true;
