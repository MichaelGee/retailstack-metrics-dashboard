import { AxiosError } from 'axios';

interface ApiErrorResponse {
  message?: string;
  errors?: {
    message?: string;
  };
}

/**
 * Extracts a user-friendly error message from an API error response.
 * Handles the Axios error shape where the response data contains a message field,
 * or a nested errors.message field.
 */
export function getApiErrorMessage(error: unknown, fallback: string = 'An error occurred'): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    return data?.message || data?.errors?.message || fallback;
  }
  if (error instanceof Error) {
    return error.message || fallback;
  }
  return fallback;
}
