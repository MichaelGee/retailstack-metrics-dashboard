import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { hasToken, getDomain } from '@/lib/auth';

// ============================================================================
// Types
// ============================================================================
interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireDomain?: boolean;
}

// ============================================================================
// Component
// ============================================================================
/**
 * ProtectedRoute Component
 *
 * Guards routes that require authentication. Redirects to login if user is not authenticated.
 * Preserves the attempted location for post-login redirect.
 *
 * @param children - The protected content to render if authenticated
 * @param redirectTo - The path to redirect to if not authenticated (default: '/auth/login')
 * @param requireDomain - Whether to also check for domain in localStorage (default: false)
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/auth/login',
  requireDomain = false,
}) => {
  const location = useLocation();

  const isAuthenticated = hasToken() && (!requireDomain || !!getDomain());

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
