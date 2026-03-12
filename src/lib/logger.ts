import * as Sentry from '@sentry/react';

// process.env.NODE_ENV is statically replaced by Vite at build time and available in Jest
declare const process: { env: { NODE_ENV: string } };
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Centralized logger that routes to Sentry in production
 * and to the console in development.
 */
export const logger = {
  /** Errors — always logged. Sent to Sentry in production. */
  error(message: string, ...args: unknown[]) {
    if (isProduction) {
      const error = args.find(a => a instanceof Error) as Error | undefined;
      Sentry.captureException(error ?? new Error(message), {
        extra: { message, args: args.filter(a => !(a instanceof Error)) },
      });
    } else {
      console.error(message, ...args);
    }
  },

  /** Warnings — always logged. Sent to Sentry as breadcrumbs in production. */
  warn(message: string, ...args: unknown[]) {
    if (isProduction) {
      Sentry.addBreadcrumb({ level: 'warning', message, data: { args } });
    } else {
      console.warn(message, ...args);
    }
  },

  /** Info — only in development. */
  info(message: string, ...args: unknown[]) {
    if (!isProduction) {
      console.info(message, ...args);
    }
  },

  /** Debug — only in development. */
  debug(message: string, ...args: unknown[]) {
    if (!isProduction) {
      console.log(message, ...args);
    }
  },
};
