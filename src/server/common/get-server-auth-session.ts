import { authOptions } from '@pages/api/auth/[...nextauth]';
import { type GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';

export const getServerAuthSession = async (ctx: {
  req: GetServerSidePropsContext['req'];
  res: GetServerSidePropsContext['res'];
}) => {
  return await getServerSession(ctx.req, ctx.res, authOptions);
};
