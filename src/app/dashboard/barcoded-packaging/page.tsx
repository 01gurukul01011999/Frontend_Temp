import HeadBarcodedPacking from '@/components/dashboard/barcodedPacking/headBarcodedPacking'
import React from 'react'
import { config } from '@/config'
  export const metadata = { title: `Bulk Upload | Dashboard | ${config.site.name}` };
   import Barcodecomp from '@/components/dashboard/barcodedPacking/barcodecomp';
import BarcodedPackagingUI from '@/components/dashboard/barcodedPacking/barcodedPackagingUI';
import WhatIsBarcodedPackaging from '@/components/dashboard/barcodedPacking/whatIsBarcodedPackaging';
import WhyUseBarcodedPackaging from '@/components/dashboard/barcodedPacking/whyUseBarcodedPackaging';
import Vendors from '@/components/dashboard/barcodedPacking/vendors';


function page(): React.JSX.Element {
  return (
    <div>
      <HeadBarcodedPacking />
      {/* Additional content for the Barcoded Packaging page can go here */}
      <Barcodecomp/>
      <BarcodedPackagingUI/>
      <WhatIsBarcodedPackaging/>
      <WhyUseBarcodedPackaging/>
      <Vendors/>

    </div>
  )
}

export default page