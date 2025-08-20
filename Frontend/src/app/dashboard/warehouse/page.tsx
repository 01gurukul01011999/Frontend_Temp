import React from 'react'
import WarehousingCard from '@/components/dashboard/warehouse/warehousing-card';
import HeadWarehouse from '@/components/dashboard/warehouse/head-warehouse'
import { config } from '@/config';
import WarehouseBenefits from '@/components/dashboard/warehouse/warehouse-benefits';
import ShippingFees from '@/components/dashboard/warehouse/shipping-fees';
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