import { Route, Routes, useLocation } from 'react-router-dom';
import { AuthLayout } from '@/layouts/AuthLayout';
import { authRoutes, inAppRoutes } from './Routes';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { DashboardProviders } from '@/contexts/Providers';
import { ErrorBoundary } from 'react-error-boundary';
import { Button } from '@/components/ui/button';
import UmbrellaIcon from '@/assets/images/umbrella.svg';
import * as Sentry from '@sentry/react';

function RouteErrorFallback({
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center space-y-1">
        <div className="flex size-14 items-center justify-center rounded-xl border border-border-primary bg-bg-primary shadow-sm">
          <img loading="lazy" src={UmbrellaIcon} alt="Error" className="size-6" />
        </div>
        <h1 className="!mt-5 text-lg font-bold text-text-primary">Something went wrong</h1>
        <p className="!mt-2 max-w-sm text-center text-sm text-text-tertiary">
          An unexpected error occurred on this page. You can try again or navigate to a different
          page.
        </p>
        <div className="!mt-8 flex items-center gap-3">
          <Button variant="secondaryGray" onClick={() => (window.location.href = '/')}>
            Go to dashboard
          </Button>
          <Button onClick={resetErrorBoundary}>Try again</Button>
        </div>
      </div>
    </div>
  );
}

function handleBoundaryError(error: Error, info: { componentStack?: string }) {
  Sentry.captureException(error, { extra: { componentStack: info.componentStack } });
}

/** Wraps children in an error boundary that auto-resets on route changes */
function RouteErrorBoundary({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <ErrorBoundary
      FallbackComponent={RouteErrorFallback}
      onError={handleBoundaryError}
      resetKeys={[location.pathname]}
    >
      {children}
    </ErrorBoundary>
  );
}

const renderRoutes = (layout, routes) => (
  <Routes>
    <Route element={layout}>
      {routes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
    </Route>
  </Routes>
);

const RouterComponent = () => (
  <Routes>
    {/* Auth routes WITHOUT UserContext to prevent API calls */}
    <Route
      path="/auth/*"
      element={<RouteErrorBoundary>{renderRoutes(<AuthLayout />, authRoutes)}</RouteErrorBoundary>}
    />
    {/* Dashboard routes WITH UserContext */}
    <Route
      path="/*"
      element={
        <DashboardProviders>
          <RouteErrorBoundary>{renderRoutes(<DashboardLayout />, inAppRoutes)}</RouteErrorBoundary>
        </DashboardProviders>
      }
    />
  </Routes>
);

export default RouterComponent;
