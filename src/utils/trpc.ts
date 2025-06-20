import { type AppRouter } from '@server/trpc/router/_app';
import { httpBatchLink, httpLink, loggerLink, splitLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import superjson from 'superjson';

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
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        splitLink({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          condition(op) {
            // If request path includes 'public' or skipBatch is true, use normal request.
            // Otherwise, batch requests.
            return op.path.includes('public') || op.context.skipBatch;
          },
          // when condition is true, use normal request
          true: httpLink({
            url: trpcEndpointURL,
            transformer: superjson,
          }),
          // when condition is false, use batching
          false: httpBatchLink({
            url: trpcEndpointURL,
            transformer: superjson,
          }),
        }),
        httpBatchLink({
          url: trpcEndpointURL,
          transformer: superjson,
        }),
      ],
    };
  },
  ssr: false,
  transformer: superjson,
});
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
