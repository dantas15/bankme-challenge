import type { Metadata } from 'next';
import { Poppins as FontSans } from 'next/font/google';
import { cn } from '@/shared/lib/utils';
import './globals.css';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: '400', // normal
});

export const metadata: Metadata = {
  title: 'Bankme Challenge',
  description:
    'Create and manage assignors and payables after you authenticate!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <div className="flex min-h-screen items-center justify-center w-100">
          {children}
        </div>
      </body>
    </html>
  );
}
