import HeadClaims from '@/components/dashboard/claims/head-claims'
import React from 'react'
import { config } from '@/config';
import Claimstab from '@/components/dashboard/claims/claimstab';
import ClaimTracking from '@/components/dashboard/claims/claim-tracking';
export const metadata = { title: `Claims | Dashboard | ${config.site.name}` };
function page(): React.JSX.Element {
  return (
    <>
    <HeadClaims />
    <Claimstab />
    <ClaimTracking/>



    
    </>
  )
}

export default page