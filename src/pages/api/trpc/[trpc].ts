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
  // responseMeta({ ctx, paths, type, errors }) {
  //   // assuming you have all your public routes with the keyword `public` in them
  //   const allPublic = paths && paths.every((path) => path.includes('public'));
  //   // checking that no procedures errored
  //   const allOk = errors.length === 0;
  //   // checking we're doing a query request
  //   const isQuery = type === 'query';
  //   if (ctx?.res && allPublic && allOk && isQuery) {
  //     // cache request for 1 day + revalidate once every second
  //     const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
  //     return {
  //       headers: {
  //         'cache-control': `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
  //       },
  //     };
  //   }
  //   return {};
  // },
});
