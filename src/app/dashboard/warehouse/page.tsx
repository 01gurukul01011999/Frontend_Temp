import React from 'react'
import WarehousingCard from '@/components/dashboard/warehouse/warehousingCard';
import HeadWarehouse from '@/components/dashboard/warehouse/headWarehouse'
import { config } from '@/config';
import WarehouseBenefits from '@/components/dashboard/warehouse/warehouseBenefits';
import ShippingFees from '@/components/dashboard/warehouse/shippingFees';
export const metadata = { title: `Warehouse | Dashboard | ${config.site.name}` };

function page(): React.JSX.Element {
  return (
    <div>
      <HeadWarehouse/>
      <WarehousingCard/>
      <WarehouseBenefits/>
      <ShippingFees/>
    </div>
  )
}

export default page