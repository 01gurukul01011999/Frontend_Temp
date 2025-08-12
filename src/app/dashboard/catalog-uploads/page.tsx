import React from 'react'
import { config } from '@/config';
import HeadCatalogUploads from '@/components/dashboard/catalogUploads/headCatalogUploads';
import CatalogUploadUI from '@/components/dashboard/catalogUploads/catalogUploadUI';
import Add from '@/components/dashboard/catalogUploads/add';
import UploadButton from '@/components/dashboard/catalogUploads/uploadButton';
export const metadata = { title: `catalog-uploads | Dashboard | ${config.site.name}` };
function page(): React.JSX.Element {
  return (
    <div>
    <HeadCatalogUploads/> 
    <Add/>
    <UploadButton/>
    <CatalogUploadUI />
    
    </div>
  )
}

export default page