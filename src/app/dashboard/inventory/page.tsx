import React from 'react'
import HeadInventory from '@/components/dashboard/inventory/head-inventory';
import TabsInventory from '@/components/dashboard/inventory/tabs-inventory';
import { config } from '@/config';


export const metadata = { title: `Inventory | Dashboard | ${config.site.name}` };

function page(): React.JSX.Element {
  return (
    <div>
      <HeadInventory />
      {/* Other components or content can go here */}
      <TabsInventory/>

    </div>
  )
}

export default page