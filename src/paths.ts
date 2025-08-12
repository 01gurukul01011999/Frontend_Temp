
export const paths = {
 home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    order: '/dashboard/order',
    return: '/dashboard/return',
    pricing: '/dashboard/pricing',
    claims: '/dashboard/claims',
    inventory: '/dashboard/inventory',
    barcodedPackaging: '/dashboard/barcoded-packaging',
    catalogUploads: '/dashboard/catalog-uploads',
    imageBulkUpload: '/dashboard/image-bulk-upload',
    payments: '/dashboard/payments',
    quality: '/dashboard/quality',
    warehouse: '/dashboard/warehouse',
   barcodedPacketScan: '/dashboard/order/barcode-scan',
   BulkCatalogUpload: '/dashboard/catalog-uploads/Bulk-Catalog-Upload',
   SingleCatalogUpload: '/dashboard/catalog-uploads/Single-Catalog-Upload',
      
   
   
   
   // product: '/dashboard/product',

   // category: '/dashboard/product/categories',
   // addCategory: '/dashboard/product/categories/add',
   // editCategory: '/dashboard/product/categories/edit',

   // brands: '/dashboard/product/brands',
   // addBrands: '/dashboard/product/brands/add',
   // editBrands: '/dashboard/product/brands/edit',
//
   // attributes: '/dashboard/product/attributes',
   // addattributes: '/dashboard/product/attributes',
   // editattributes: '/dashboard/product/attributes',
//
   // bundleDeals: '/dashboard/product/bundle_deals',
   // addBundleDeals: '/dashboard/product/bundle_deals/add',
   // editBundleDeals: '/dashboard/product/bundle_deals/edit',
//
   // products: '/dashboard/product/products',
   // editProduct: '/dashboard/product/products/edit',
   // addProduct: '/dashboard/product/products/add',
    
    rating_reviews: '/dashboard/rating-reviews',
    bulk_upload: '/dashboard/bulk-upload',
    accounts: '/dashboard/withdrawal/accounts',
    requests: '/dashboard/withdrawal/requests',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    integrations: '/dashboard/integrations',
    settings: '/dashboard/settings',
    
   
  },
  errors: { notFound: '/errors/not-found' },
} as const;
