import React from 'react'
import HeadImageBulkUpload from '@/components/dashboard/Image-bulk-upload/head-image-bulk-upload';
import { config } from '@/config';
export const metadata = { title: `Image Bulk Upload | Dashboard | ${config.site.name}` };
import ImageBulkUpload from '@/components/dashboard/Image-bulk-upload/image-bulk-upload';
function page(): React.JSX.Element {
  return (
    <div>
      <HeadImageBulkUpload />
      {/* Additional content for the Image Bulk Upload page can go here */}
      <ImageBulkUpload />
    </div>
  )
}

export default page