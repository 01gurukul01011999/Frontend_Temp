import React from 'react'
import { config } from '@/config';
export const metadata = { title: `Bulk Upload | Dashboard | ${config.site.name}` };
function page(): React.JSX.Element {
  return (
    <div>Bulk Upload</div>
  )
}

export default page