import React, { Suspense } from 'react';
import AuthCallbackClient from './auth-callback-client';

export default function Page(): React.JSX.Element {
 
  // Server component that renders the client callback handler.
  // Wrap the client component in Suspense so hooks like useSearchParams don't cause a CSR bailout.
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Verifying...</div>}>
      <AuthCallbackClient />
    </Suspense>
  );
}
 export const dynamic = "force-dynamic";