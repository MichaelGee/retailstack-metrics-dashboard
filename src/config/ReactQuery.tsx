import { STALE } from '@/common/QueryStaleTime';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import {
  defaultShouldDehydrateQuery,
  QueryClient,
  QueryCache,
  MutationCache,
} from '@tanstack/react-query';
import {
  PersistQueryClientProvider,
  removeOldestQuery,
} from '@tanstack/react-query-persist-client';
import { AxiosError } from 'axios';
import * as Sentry from '@sentry/react';

const persister = createAsyncStoragePersister({
  storage: window.localStorage,
  retry: removeOldestQuery,
});

const persistOptions = {
  persister,
  gcTime: STALE.HOURS.TWELVE,
  dehydrateOptions: {
    shouldDehydrateQuery: query => {
      return defaultShouldDehydrateQuery(query) && query?.meta?.persist === true;
    },
  },
};

/** Status codes that should not be retried */
const NON_RETRYABLE_STATUSES = new Set([400, 401, 403, 404, 409, 422]);

function shouldRetry(failureCount: number, error: Error): boolean {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    if (status && NON_RETRYABLE_STATUSES.has(status)) return false;
  }
  return failureCount < 3;
}

function handleQueryError(error: Error) {
  // Don't toast or report auth errors — handled by the Axios interceptor
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    if (status === 401 || status === 403) return;
  }

  Sentry.captureException(error, { tags: { layer: 'react-query' } });
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: handleQueryError,
  }),
  mutationCache: new MutationCache({
    onError: error => {
      // Mutations already show toasts in their individual onError callbacks,
      // so we only report to Sentry here
      Sentry.captureException(error, { tags: { layer: 'react-query-mutation' } });
    },
  }),
  defaultOptions: {
    queries: {
      retry: shouldRetry,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 1000 * 60 * 2, // 2 minutes — prevents excessive refetching
      refetchOnWindowFocus: true,
    },
  },
});

export const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
      {children}
    </PersistQueryClientProvider>
  );
};

export default ReactQueryProvider;
