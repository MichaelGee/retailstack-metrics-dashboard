import { useQuery } from '@tanstack/react-query';
import { api } from './api';
import { STALE } from '@/common/QueryStaleTime';

const is401Error = (error: unknown) => {
  return (error as { response?: { status?: number } })?.response?.status === 401;
};

export const useGetUser = () => {
  // Check if we have a token and tenant to determine if the query should be enabled
  const token = window.localStorage.getItem('accessToken');
  const tenant = window.localStorage.getItem('domain');

  // Don't call API on auth pages
  const isOnAuthPage = window.location.pathname.startsWith('/auth/');

  // Disable user fetching until API is connected
  const hasApiUrl = !!import.meta.env.VITE_API_BASEURL;

  return useQuery({
    queryKey: ['user'],
    queryFn: () => api.get('/auth/current-user').then(res => res.data),
    retry: (failureCount, error) => {
      if (is401Error(error)) return false;
      return failureCount < 1;
    },
    staleTime: STALE.MINUTES.FIFTEEN,
    meta: { persist: true },
    enabled: hasApiUrl && !!token && !!tenant && !isOnAuthPage,
  });
};
