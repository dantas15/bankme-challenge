import useSWR from 'swr';
import { fetchClient } from '@/shared/lib/fetch-client';
import { Payable } from '@/shared/schemas/payable-schema';

function useFetchPayables(authToken: string) {
  const fetcher = (url: string) => fetchClient<Payable[]>(url, { authToken });
  const { data, error, isLoading } = useSWR('/integrations/payables', fetcher);
  return { data, error, isLoading };
}

export { useFetchPayables };
