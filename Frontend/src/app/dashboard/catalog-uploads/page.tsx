import React from 'react'
import { config } from '@/config';
import HeadCatalogUploads from '@/components/dashboard/catalog-uploads/head-catalog-uploads';
import CatalogUploadUI from '@/components/dashboard/catalog-uploads/catalog-upload-ui';
import Add from '@/components/dashboard/catalog-uploads/add';
import UploadButton from '@/components/dashboard/catalog-uploads/upload-button';
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