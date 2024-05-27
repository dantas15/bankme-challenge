import { apiUrl } from '@/shared/constants/api-url';
import {
  ApiErrorResponse,
  apiErrorResponseSchema,
} from '@/shared/schemas/api-response-schema';

type FetchOptions = Omit<RequestInit, 'headers'> & {
  headers?: HeadersInit;
  authToken?: string;
};

async function fetchClient<T>(
  url: string,
  options: FetchOptions = {}
): Promise<ApiErrorResponse | T> {
  const { authToken, headers, ...restOptions } = options;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (authToken) {
    defaultHeaders['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${apiUrl}${url}`, {
    ...restOptions,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  });

  return await response.json();
}

export { fetchClient };
