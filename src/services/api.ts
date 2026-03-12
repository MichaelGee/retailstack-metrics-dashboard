import { toast } from '@/hooks/use-toast';
import axios, { RawAxiosRequestHeaders, AxiosInstance, AxiosError } from 'axios';
import { handleSessionExpired } from '@/lib/auth';
import * as Sentry from '@sentry/react';

// create an axios instance
export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASEURL,
  headers: {
    'Content-Type': 'application/json',
  } as RawAxiosRequestHeaders,
});

const debounce = (fn, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

// Modified health check logic
let isCheckingHealth = false;

const checkHealth = debounce(async () => {
  if (isCheckingHealth) return;
  isCheckingHealth = true;

  try {
    await axios.get(`${import.meta.env.VITE_API_BASEURL}/health-check`, { timeout: 5000 });
  } catch {
    toast({
      title: 'Network Error',
      description: 'Server is unreachable',
      variant: 'destructive',
    });
  } finally {
    isCheckingHealth = false;
  }
}, 5000);

// request interceptor
api.interceptors.request.use(
  async config => {
    const token = localStorage.getItem('accessToken');
    const tenant = localStorage.getItem('domain');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Add tenant domain header if available
    if (tenant) {
      config.headers['X-Tenant-Domain'] = tenant;
    }
    return config;
  },
  error => Promise.reject(error)
);

// response interceptor
api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    if (error.code === 'ERR_NETWORK') {
      Sentry.captureException(error, { tags: { layer: 'network' } });
      checkHealth();
      return Promise.reject(error);
    }

    const status = error.response?.status;

    switch (status) {
      case 401:
        handleSessionExpired();
        break;
      case 403:
        toast({
          title: 'Access Forbidden',
          description: 'You do not have permission to perform this action.',
          variant: 'destructive',
        });
        break;
      case 404:
        // 404s are expected for some flows — don't report to Sentry
        break;
      case 500:
      default:
        // Report 5xx and unexpected errors to Sentry
        if (status && status >= 500) {
          Sentry.captureException(error, {
            tags: { layer: 'api', status_code: String(status) },
            extra: { url: error.config?.url, method: error.config?.method },
          });
        }
    }

    return Promise.reject(error);
  }
);

export default api;
