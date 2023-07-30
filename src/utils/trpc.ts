import { httpBatchLink, httpLink, loggerLink, splitLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import superjson from 'superjson';

import { type AppRouter } from '@server/trpc/router/_app';

export const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '';
  // For prod, we get the base url via env variable
  if (process.env.VERCEL_ENV === 'production') return `https://${process.env.PRODUCTION_BASE_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

const trpcEndpointURL = `${getBaseUrl()}/api/trpc`;

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        splitLink({
          condition(op) {
            // check for context property `cache`
            return op.path.startsWith('public');
          },
          // when condition is true, use normal request
          true: httpLink({
            url: trpcEndpointURL,
          }),
          // when condition is false, use batching
          false: httpBatchLink({
            url: trpcEndpointURL,
          }),
        }),
        httpBatchLink({
          url: trpcEndpointURL,
        }),
      ],
    };
  },
  ssr: false,
});
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
