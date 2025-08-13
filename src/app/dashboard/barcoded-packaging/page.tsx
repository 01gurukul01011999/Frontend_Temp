import React from 'react'
import { config } from '@/config'
  export const metadata = { title: `Bulk Upload | Dashboard | ${config.site.name}` };
   import Barcodecomp from '@/components/dashboard/barcoded-packing/barcodecomp';
import BarcodedPackagingUI from '@/components/dashboard/barcoded-packing/barcoded-packaging-ui';
import WhatIsBarcodedPackaging from '@/components/dashboard/barcoded-packing/what-is-barcoded-packaging';
import WhyUseBarcodedPackaging from '@/components/dashboard/barcoded-packing/why-use-barcoded-packaging';
import Vendors from '@/components/dashboard/barcoded-packing/vendors';
import HeadBarcodedPacking from '@/components/dashboard/barcoded-packing/head-barcoded-packing'


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