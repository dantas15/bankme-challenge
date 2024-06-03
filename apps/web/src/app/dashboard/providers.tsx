import { AuthContextProvider } from '@/shared/contexts/auth-context';

export function DashboardProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthContextProvider>{children}</AuthContextProvider>;
}
