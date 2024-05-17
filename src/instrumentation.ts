import * as Sentry from '@sentry/nextjs';
import {EnvPattern} from "@lib/constants";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
const PATH_URL = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_API_URL;

export function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        // this is your Sentry.init call from `sentry.server.config.js|ts`
        Sentry.init({
            dsn: SENTRY_DSN,
            // Adjust this value in production, or use tracesSampler for greater control
            tracesSampleRate: 0.1,
            enabled: !EnvPattern.some(element => PATH_URL?.includes(element)),
        });
    }

    // This is your Sentry.init call from `sentry.edge.config.js|ts`
    if (process.env.NEXT_RUNTIME === 'edge') {
        Sentry.init({
            dsn: SENTRY_DSN,
            // Adjust this value in production, or use tracesSampler for greater control
            tracesSampleRate: 0.1,
            enabled: !EnvPattern.some(element => PATH_URL?.includes(element)),
        });
    }
}
