'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import GlobalStyles from '@mui/material/GlobalStyles';
import { DashboardGate } from '@/components/auth/dashboard-gate';
import { MainNav } from '@/components/dashboard/layout/main-nav';
import { SideNav } from '@/components/dashboard/layout/side-nav';
import { UserProvider } from '@/contexts/user-context';
import { useRouter, usePathname } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  
  return (
    <DashboardGate>
      <UserProvider>
      <GlobalStyles
        styles={{
          body: {
            '--MainNav-height': '56px',
            '--MainNav-zIndex': 1000,
            '--SideNav-width': '200px',
            '--SideNav-zIndex': 1100,
            '--MobileNav-width': '200px',
            '--MobileNav-zIndex': 1100,
          },
        }}
      />
  <Box
        sx={{
          bgcolor: '#e1e1e1', // light gray background
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          minHeight: '100%',
        }}
      >
        <SideNav />
        <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column', pl: { lg: 'var(--SideNav-width)' } }}>
          <MainNav />
          <main>
            <Container maxWidth="xl" sx={{ py: '0' }}>
              {children}
            </Container>
          </main>
        </Box>
      </Box>
      </UserProvider>
    </DashboardGate>
  );
}
