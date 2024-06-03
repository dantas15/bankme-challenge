'use client';

import { AuthContextProvider } from '@/shared/contexts/auth-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthContextProvider>{children}</AuthContextProvider>;
}
