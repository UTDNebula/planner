/* eslint-disable @typescript-eslint/no-var-requires */
const { withSentryConfig } = require('@sentry/nextjs');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

/* eslint-disable @typescript-eslint/no-var-requires */

const checkValidatorAvailability = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_VALIDATOR}/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
};

module.exports = async (phase) => {
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
    modularizeImports: {
      '@mui/material': {
        transform: '@mui/material/{{member}}',
      },
      '@mui/icons-material': {
        transform: '@mui/icons-material/{{member}}',
      },
    },
    rewrites: async () => {
      return [
        {
          source: '/',
          destination: '/index.html',
        },
      ];
    },
  });

  const sentryConfig = withSentryConfig(
    nextConfig,
    { silent: true },
    // tunnelRoute set to bypass adblockers.
    // See: https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#configure-tunneling-to-avoid-ad-blockers.
    { hideSourcemaps: false, tunnelRoute: '/sentry-tunnel' },
  );
  return sentryConfig;
};
