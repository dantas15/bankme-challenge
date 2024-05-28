import { apiUrl } from '@/shared/constants/api-url';

type FetchOptions = Omit<RequestInit, 'headers' | 'body'> & {
  headers?: HeadersInit;
  body?: Record<string, any>;
  authToken?: string;
};

async function fetchClient<T>(url: string, options: FetchOptions = {}) {
  const { authToken, headers, body, ...restOptions } = options;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };
  let defaultBody: BodyInit = '';

  if (authToken) {
    defaultHeaders['Authorization'] = `Bearer ${authToken}`;
  }

  if (body) {
    defaultBody = JSON.stringify(body);
  }

  return fetch(`${apiUrl}${url}`, {
    ...restOptions,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    body: defaultBody,
  });
}

export { fetchClient };
