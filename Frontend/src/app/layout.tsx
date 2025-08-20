import * as React from 'react';
import type { Viewport } from 'next';
import '@/styles/global.css';
import { UserProvider } from '@/contexts/user-context';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';

export const viewport = { width: 'device-width', initialScale: 1 } satisfies Viewport;

export const metadata = {
  icons: {
    icon: '/favicon.ico',
  
  },

  title: 'Seller | Dashboard',
  description: 'Your dashboard description here',
  keywords: ['dashboard', 'seller', 'orders', 'returns'],
  appleWebApp: {
    title: 'Seller | Dashboard',
    statusBarStyle: 'black-translucent',
  },
};


interface LayoutProps {
  children: React.ReactNode;
}
 
export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <html lang="en">
      <body>
        <LocalizationProvider>
          <UserProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </UserProvider>
        </LocalizationProvider>
      </body>
    </html>
  );
}

// Keep this file:
// filepath: public/favicon.ico
