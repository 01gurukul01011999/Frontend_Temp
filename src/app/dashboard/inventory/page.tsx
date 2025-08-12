import React from 'react'
import HeadInventory from '@/components/dashboard/inventory/headInventory';
import TabsInventory from '@/components/dashboard/inventory/tabsInventory';
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