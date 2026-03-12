import { useMutation } from '@tanstack/react-query';
import { api } from './api';
import { toast } from '@/hooks/use-toast';
import { getApiErrorMessage } from '@/lib/apiError';
import { setAccessToken, setDomain } from '@/lib/auth';

export const useLoginEndpoint = () => {
  return useMutation({
    mutationFn: (data: { email: string; password: string; tenant_id?: string }) =>
      api.post('/auth/login', data),
    onSuccess: data => {
      setAccessToken(data?.data?.token);
      if (data?.data?.user?.tenant) {
        setDomain(data.data.user.tenant);
      }
    },
    onError: error => {
      toast({
        title: 'An error occurred',
        description: getApiErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};
