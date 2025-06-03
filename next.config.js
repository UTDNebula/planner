const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

/* eslint-disable @typescript-eslint/no-var-requires */

const checkValidatorAvailability = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_VALIDATOR}/health`);
    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

const createConfig = async (phase) => {
  if (phase === 'phase-development-server') {
    const isValidatorReachable = await checkValidatorAvailability();

    if (!isValidatorReachable) {
      console.error('Start validator server first before running next dev server.');
      process.exit(1);
    }
  }

  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  });

  const nextConfig = withBundleAnalyzer({
    redirects: async () => {
      return [
        {
          source: '/',
          destination: 'https://www.utdnebula.com/projects/planner',
          permanent: true,
        },
      ];
    },
  });
  return nextConfig;
};

// Injected content via Sentry wizard below

const { withSentryConfig } = require('@sentry/nextjs');

module.exports = (phase, args) => withSentryConfig(createConfig(phase, args), {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: 'utdnebula',
  project: 'planner',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
