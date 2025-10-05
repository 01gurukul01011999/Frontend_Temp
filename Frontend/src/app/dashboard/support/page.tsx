import React from 'react';
import { config } from '@/config';
import HeadSupport from '@/components/dashboard/support/head-support';
import TabSupport from '@/components/dashboard/support/tab-support';


export const metadata = { title: `Support | Dashboard | ${config.site.name}` };

function page(): React.JSX.Element {
  return (
    <>
  <HeadSupport/>
  <TabSupport/>
     

    </>
  )
}

export default page