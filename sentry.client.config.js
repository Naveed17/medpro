// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
const PATH_URL = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_API_URL;

Sentry.init({
    dsn: SENTRY_DSN,
    // Adjust this value in production, or use tracesSampler for greater control, For development purposes you can keep it at 1.0. For production it is better to decrease this to 0.1
    tracesSampleRate: 0.1,
    enabled: !["develop", "master"].some(element => PATH_URL.includes(element)),
    // This sets the sample rate to be 10%. You may want this to be 100% while
    // in development and sample at a lower rate in production
    replaysSessionSampleRate: 0.1,
    // If the entire session is not sampled, use the below sample rate to sample
    // sessions when an error occurs.
    replaysOnErrorSampleRate: 1.0,
    // Session Replay
    integrations: [new Sentry.Replay()],
    // ...
    // Note: if you want to override the automatic release value, do not set a
    // `release` value here - use the environment variable `SENTRY_RELEASE`, so
    // that it will also get attached to your source maps
});
