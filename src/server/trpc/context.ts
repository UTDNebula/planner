import { type inferAsyncReturnType } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { type Session } from 'next-auth';

import { getServerAuthSession } from '../common/get-server-auth-session';
import { prisma } from '../db/client';
import { platformPrisma } from '../db/platform_client';
type CreateInnerContextOptions = {
  session: Session | null;
};

export type Context = inferAsyncReturnType<typeof createContextInner> & Partial<CreateNextContextOptions>;

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
export const createContextInner = async (opts: CreateInnerContextOptions) => {
  return {
    session: opts.session,
    prisma,
    platformPrisma,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateNextContextOptions): Promise<Context> => {
  const { req, res } = opts;

  // Get the session from the server using the getServerSession wrapper function
  const session = await getServerAuthSession({ req, res });

  const contextInner = await createContextInner({
    session,
  });

  return {
    ...contextInner, req, res,
  } ;
};
