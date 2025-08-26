import * as React from 'react';
import type { Metadata } from 'next';

import { GuestGuard } from '@/modules/authentication';
import { EnhancedSignInForm } from '@/modules/authentication/components/enhanced-sign-in-form';

export const metadata = { title: `Sign in | Techpotli Seller Panel` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <GuestGuard>
          <EnhancedSignInForm />
        </GuestGuard>
      </div>
    </div>
  );
}
