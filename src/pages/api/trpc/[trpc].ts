import { createNextApiHandler } from '@trpc/server/adapters/next';

import { createContext } from '@server/trpc/context';
import { appRouter } from '@server/trpc/router/_app';
import { env } from 'src/env/server.mjs';

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext,
  onError:
    env.NODE_ENV === 'development'
      ? ({ path, error }) => {
          console.error(`❌ tRPC failed on ${path}: ${error}`);
        }
      : undefined,
  responseMeta(opts) {
    const { ctx, paths, errors, type } = opts;
    // assuming you have all your public routes with the keyword `public` in them
    const allPublic = paths && paths.every((path) => path.includes('public'));
    // checking that no procedures errored
    const allOk = errors.length === 0;
    // checking we're doing a query request
    const isQuery = type === 'query';
    if (ctx?.res && allPublic && allOk && isQuery) {
      const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
      const ONE_WEEK_IN_SECONDS = ONE_DAY_IN_SECONDS * 7;
      return {
        headers: {
          'cache-control': `s-maxage=${ONE_DAY_IN_SECONDS}, stale-while-revalidate=${ONE_WEEK_IN_SECONDS}`,
        },
      };
    }
    return {};
  },
});
