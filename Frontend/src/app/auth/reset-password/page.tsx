import * as React from 'react';
import type { Metadata } from 'next';

import { GuestGuard, AuthLayout, ResetPasswordForm } from '@/modules/authentication';

export const metadata = { title: `Reset password | Auth | Techpotli Seller Panel` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <AuthLayout>
      <GuestGuard>
        <ResetPasswordForm />
      </GuestGuard>
    </AuthLayout>
  );
}
