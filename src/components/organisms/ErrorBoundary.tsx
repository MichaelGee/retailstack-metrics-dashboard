import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import * as Sentry from '@sentry/react';
import { logger } from '@/lib/logger';
import { Button } from '@/components/ui/button';
import UmbrellaIcon from '@/assets/images/umbrella.svg';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('ErrorBoundary caught:', error, errorInfo);
    Sentry.captureException(error, { extra: { componentStack: errorInfo.componentStack } });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-bg-primary px-6">
          <div className="flex flex-col items-center space-y-1">
            <div className="flex size-14 items-center justify-center rounded-xl border border-border-primary bg-bg-primary shadow-sm">
              <img loading="lazy" src={UmbrellaIcon} alt="Error" className="size-6" />
            </div>
            <h1 className="!mt-5 text-lg font-bold text-text-primary">Something went wrong</h1>
            <p className="!mt-2 max-w-sm text-center text-sm text-text-tertiary">
              An unexpected error occurred. You can try reloading the page or go back to the
              dashboard.
            </p>
            <div className="!mt-8 flex items-center gap-3">
              <Button variant="secondaryGray" onClick={this.handleGoHome}>
                Go to dashboard
              </Button>
              <Button onClick={this.handleReload}>Reload page</Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
