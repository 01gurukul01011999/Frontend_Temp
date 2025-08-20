import HeadPricing from '@/components/dashboard/pricing/head-pricing'
import React from 'react'
import { config } from '@/config';
export const metadata = { title: `Pricing | Dashboard | ${config.site.name}` };
function page(): React.JSX.Element {
  return (
    <>
    <HeadPricing />
    </>
  )
}

export default page