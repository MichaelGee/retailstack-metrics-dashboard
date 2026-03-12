import { removeLocalStorageItem, setLocalStorageItem, getLocalStorageItem } from './localStorage';

// ============================================================================
// Constants
// ============================================================================

/** Keys that belong to the auth domain — cleared on session expiry and logout */
const AUTH_KEYS = ['accessToken', 'domain'] as const;

/**
 * Zustand store persistence keys — cleared ONLY on explicit user logout.
 * Preserved on 401/session expiry so users don't lose in-progress work.
 */
const ZUSTAND_STORE_KEYS: readonly string[] = [] as const;

// ============================================================================
// Concurrent 401 Guard
// ============================================================================

let isLoggingOut = false;
let logoutTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Ensures only the first caller in a burst of concurrent 401 responses
 * triggers a toast + redirect. Subsequent calls within 1 second are no-ops.
 */
function withLogoutGuard(fn: () => void): void {
  if (isLoggingOut) return;
  isLoggingOut = true;
  fn();
  if (logoutTimer) clearTimeout(logoutTimer);
  logoutTimer = setTimeout(() => {
    isLoggingOut = false;
  }, 1000);
}

// ============================================================================
// Token Operations
// ============================================================================

export function setAccessToken(token: string): void {
  setLocalStorageItem('accessToken', token);
}

export function getAccessToken(): string | null {
  return getLocalStorageItem('accessToken');
}

export function setDomain(domain: string): void {
  setLocalStorageItem('domain', domain);
}

export function getDomain(): string | null {
  return getLocalStorageItem('domain');
}

/**
 * Checks whether an access token exists in localStorage.
 * The backend uses Laravel Sanctum opaque tokens (not JWT),
 * so validity can only be confirmed server-side via API calls.
 */
export function hasToken(): boolean {
  return !!getAccessToken();
}

// ============================================================================
// Logout Operations
// ============================================================================

/**
 * Clears ONLY auth-related keys. Preserves Zustand stores so users
 * don't lose in-progress work.
 */
export function clearAuthState(): void {
  AUTH_KEYS.forEach(key => removeLocalStorageItem(key));
}

/**
 * Clears auth keys AND all Zustand store persistence keys.
 * Used ONLY for explicit user-initiated logout.
 */
export function clearAllState(): void {
  AUTH_KEYS.forEach(key => removeLocalStorageItem(key));
  ZUSTAND_STORE_KEYS.forEach(key => {
    window.localStorage.removeItem(key);
  });
}

/**
 * Handles forced logout (401, session expiry).
 * Guarded against concurrent calls — only the first in a burst
 * triggers the toast and redirect.
 */
export function handleSessionExpired(): void {
  withLogoutGuard(() => {
    const returnTo = window.location.pathname;
    clearAuthState();
    // Flag for the login page to show the toast after the hard redirect.
    // sessionStorage survives navigation but not tab close.
    window.sessionStorage.setItem('sessionExpired', 'true');
    const loginUrl =
      returnTo && returnTo !== '/auth/login'
        ? `/auth/login?returnTo=${encodeURIComponent(returnTo)}`
        : '/auth/login';
    window.location.assign(loginUrl);
  });
}

/**
 * Handles explicit user-initiated logout.
 * Clears everything including work-in-progress stores.
 */
export function handleUserLogout(): void {
  const returnTo = window.location.pathname;
  clearAllState();
  const loginUrl =
    returnTo && returnTo !== '/auth/login'
      ? `/auth/login?returnTo=${encodeURIComponent(returnTo)}`
      : '/auth/login';
  window.location.assign(loginUrl);
}
