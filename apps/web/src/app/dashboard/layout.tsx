'use client';

import { AuthContextProvider } from '@/shared/contexts/auth-context';
import { useAuth } from '@/shared/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isLoading, accessToken } = useAuth();
  useEffect(() => {
    if (!isLoading && !accessToken) {
      router.replace('/');
    }
  }, [isLoading, accessToken, router]);
  return <AuthContextProvider>{children}</AuthContextProvider>;
}
