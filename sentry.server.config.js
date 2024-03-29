// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn:
    SENTRY_DSN ||
    'https://edb9e327f9024e7599eae859bad9be47@o4504918397353984.ingest.sentry.io/4504924302409728',
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.25,
  // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV || 'development',
});
