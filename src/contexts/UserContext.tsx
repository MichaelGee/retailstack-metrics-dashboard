import React, { createContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useGetUser } from '@/services/user.service';
import { USERDATA } from './types';
import { getLocalStorageItem } from '@/lib/localStorage';
import { handleUserLogout } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { toast } from '@/hooks/use-toast';

// ============================================================================
// Constants
// ============================================================================
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  DOMAIN: 'domain',
} as const;

const PROTECTED_ROUTES = {
  AUTH: '/auth/',
} as const;

const USER_QUERY_KEY = ['user'] as const;

// ============================================================================
// Types
// ============================================================================
type UserContextType = {
  userData: USERDATA;
  setUserData: React.Dispatch<React.SetStateAction<USERDATA>>;
  logoutUser: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  refetchUser: () => void;
};

type UserProviderProps = {
  children: React.ReactNode;
};

type StorageChangeEvent = CustomEvent<{
  key: string;
  newValue: string | null;
  oldValue: string | null;
}>;

type ApiError = {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
  message?: string;
};

// ============================================================================
// Helper Functions
// ============================================================================
const isProtectedRoute = (pathname: string): boolean => {
  return Object.values(PROTECTED_ROUTES).some(route => pathname.startsWith(route));
};

const is401Error = (error: unknown): boolean => {
  return (error as ApiError)?.response?.status === 401;
};

const getErrorMessage = (error: unknown): string => {
  const apiError = error as ApiError;
  return apiError?.response?.data?.message || apiError?.message || 'An unexpected error occurred';
};

// ============================================================================
// Context
// ============================================================================
export const UserContext = createContext<UserContextType | null>(null);

// ============================================================================
// Provider Component
// ============================================================================
export const UserProvider = ({ children }: UserProviderProps) => {
  const [localUserData, setLocalUserData] = useState<USERDATA>(null);
  const [storageVersion, setStorageVersion] = useState(0);
  const queryClient = useQueryClient();

  // Re-read from localStorage whenever storageVersion bumps (on storage events)

  const accessToken = useMemo(
    () => getLocalStorageItem(STORAGE_KEYS.ACCESS_TOKEN),
    [storageVersion]
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const domain = useMemo(() => getLocalStorageItem(STORAGE_KEYS.DOMAIN), [storageVersion]);
  const isOnProtectedRoute = isProtectedRoute(window.location.pathname);

  // User query (conditional fetching is handled in the service)
  const { data, isLoading, error, refetch: refetchUser } = useGetUser();

  // ============================================================================
  // Callbacks
  // ============================================================================
  const handleTokenChange = useCallback(
    (newValue: string | null) => {
      setStorageVersion(v => v + 1);

      if (isProtectedRoute(window.location.pathname)) return;

      if (newValue) {
        queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      } else {
        queryClient.setQueryData(USER_QUERY_KEY, null);
        setLocalUserData(null);
      }
    },
    [queryClient]
  );

  const logoutUser = useCallback(() => {
    setLocalUserData(null);
    queryClient.clear();
    handleUserLogout();
  }, [queryClient]);

  // ============================================================================
  // Effects
  // ============================================================================
  // Handle storage changes (cross-tab and same-tab synchronization)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.ACCESS_TOKEN) {
        handleTokenChange(e.newValue);
      }
    };

    const handleLocalStorageChange = (e: StorageChangeEvent) => {
      if (e.detail.key === STORAGE_KEYS.ACCESS_TOKEN) {
        handleTokenChange(e.detail.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageChange', handleLocalStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleLocalStorageChange as EventListener);
    };
  }, [handleTokenChange]);

  // Handle non-401 errors (401s are handled centrally by the API interceptor)
  useEffect(() => {
    if (!error || isLoading || isOnProtectedRoute) return;
    if (is401Error(error)) return;

    logger.error('User fetch error:', error);
    toast({
      title: 'Error',
      description: getErrorMessage(error),
      variant: 'destructive',
    });
  }, [error, isLoading, isOnProtectedRoute]);

  // Refetch user when credentials change (for non-protected routes)
  useEffect(() => {
    if (accessToken && domain && !isOnProtectedRoute) {
      refetchUser();
    }
  }, [accessToken, domain, isOnProtectedRoute, refetchUser]);

  // ============================================================================
  // Memoized Context Value
  // ============================================================================
  const contextValue = useMemo<UserContextType>(
    () => ({
      userData: localUserData ?? (data?.user ? { ...data.user } : null),
      setUserData: setLocalUserData,
      logoutUser,
      isLoading,
      isAuthenticated: !!accessToken && !!data?.user,
      refetchUser,
    }),
    [localUserData, data?.user, logoutUser, isLoading, accessToken, refetchUser]
  );

  // ============================================================================
  // Render
  // ============================================================================
  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

// ============================================================================
// Custom Hook
// ============================================================================
/**
 * Custom hook to access user context throughout the application
 * @throws {Error} If used outside of UserProvider
 * @returns {UserContextType} User context containing userData, authentication state, and user actions
 */
export const useUser = (): UserContextType => {
  const context = React.useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};
