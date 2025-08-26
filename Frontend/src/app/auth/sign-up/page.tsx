import * as React from 'react';
import type { Metadata } from 'next';

import { GuestGuard, ModernLayout } from '@/modules/authentication';
import { EnhancedSignUpForm } from '@/modules/authentication/components/enhanced-sign-up-form';

export const metadata = { title: `Sign up | Techpotli Seller Panel` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <ModernLayout>
      <GuestGuard>
        <EnhancedSignUpForm />
      </GuestGuard>
    </ModernLayout>
  );
}
