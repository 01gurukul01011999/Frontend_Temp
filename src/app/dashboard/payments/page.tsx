import React from 'react'
import { config } from '@/config';
export const metadata = { title: `Payments | Dashboard | ${config.site.name}` };
import HeadPayments from '@/components/dashboard/payments/headPayments';
import PaymentDashboard from '@/components/dashboard/payments/paymentDashboard';

function page(): React.JSX.Element {
  return (
    <div>
      <HeadPayments />
      {/* Additional content for the Payments page can go here */}
      <PaymentDashboard/>
    </div>
  )
}

export default page