import React from 'react';
import { config } from '@/config';
import NoticesUi from '@/components/dashboard/notices/notices';

export const metadata = { title: `Notices | Dashboard | ${config.site.name}` };

function page(): React.JSX.Element {
  return (
    <>
   
     <NoticesUi/>

    </>
  )
}

export default page