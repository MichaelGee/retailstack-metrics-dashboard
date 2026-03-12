import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';

/** Wraps a lazy-loaded component in Suspense */
function lazyPage(factory: () => Promise<{ default: React.ComponentType }>) {
  const Component = lazy(factory);
  return (
    <Suspense fallback={null}>
      <Component />
    </Suspense>
  );
}

// Non-lazy: Page404 stays eagerly loaded (small, used as fallback in every route group)
import Page404 from '@/pages/Page404';

// Auth pages
const Login = lazyPage(() => import('@/pages/Auth/Login'));

// Dashboard pages
const Home = lazyPage(() => import('@/pages/Home'));

export const authRoutes = [
  { path: 'login', element: Login },
  { path: '*', element: <Page404 /> },
];

export const inAppRoutes = [
  { path: '/', element: <Navigate to="/home" /> },
  { path: 'home', element: Home },
  { path: '*', element: <Page404 /> },
];
