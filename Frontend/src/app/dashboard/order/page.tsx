import * as React from 'react';
import Head from '@/components/dashboard/order/head';
import TabsFilter from '@/components/dashboard/order/tabs-filter';
import { config } from '@/config';

import BarcodedPackaging from '@/components/dashboard/order/barcoded-packaging';

export const metadata = { title: `Orders | Dashboard | ${config.site.name}` };



export default function Page(): React.JSX.Element {

  return (
    <div>
      <Head/>
      <BarcodedPackaging/>
      <TabsFilter/>
     
    </div>
  );
}
