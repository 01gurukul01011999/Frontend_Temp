import * as React from 'react';
import  HeadReturn  from '@/components/dashboard/returns/head-return';
import TabsReturn from '@/components/dashboard/returns/tabsreturn';
import { config } from '@/config';


export const metadata = { title: `Returns | Dashboard | ${config.site.name}` };

export default function Page(): React.JSX.Element {
   
  return (
    <div>
      <HeadReturn />
        <TabsReturn/>
      

    </div>
  )
}
