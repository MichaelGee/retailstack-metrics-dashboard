import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import * as Sentry from '@sentry/react';
import { MotionProvider } from './contexts/MotionContext';

if (import.meta.env.MODE !== 'dev' || import.meta.env.VITE_APP_ENV !== 'develop') {
  Sentry.init({
    environment: import.meta.env.VITE_APP_ENV,
    dsn: import.meta.env.VITE_SENTRY_DSN,
    sendDefaultPii: true,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 0.2,
  });
}

// Global error handlers — capture uncaught errors in Sentry
window.addEventListener('unhandledrejection', event => {
  Sentry.captureException(event.reason ?? new Error('Unhandled promise rejection'));
});

window.addEventListener('error', event => {
  Sentry.captureException(event.error ?? new Error(event.message));
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionProvider>
      <App />
    </MotionProvider>
  </StrictMode>
);
