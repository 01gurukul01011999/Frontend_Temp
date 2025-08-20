import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  {key: 'dashboard', title: 'Home', href: paths.dashboard.overview, icon: 'home'},
  {key: 'order', title: 'Orders', href: paths.dashboard.order, icon: 'order' },
  {key: 'return', title: 'Returns', href: paths.dashboard.return, icon: 'arrow-down' },
  {key: 'pricing', title: 'Pricing', href: paths.dashboard.pricing, icon: 'currency-inr' },
  {key: 'claims', title: 'Claims', href: paths.dashboard.claims, icon: 'money-wavy' },
  {key: 'inventory', title: 'Inventory', href: paths.dashboard.inventory, icon: 'clipboard-text' },
  {key: 'barcodedPackaging', title: 'Barcoded Packaging', href: paths.dashboard.barcodedPackaging, icon: 'barcode' },
  {key: 'catalogUploads', title: 'Catalog Uploads', href: paths.dashboard.catalogUploads, icon: 'upload-simple' },
  {key: 'imageBulkUpload', title: 'Image Bulk Upload', href: paths.dashboard.imageBulkUpload, icon: 'images' },
  {key: 'payments', title: 'Payments', href: paths.dashboard.payments, icon: 'Wallet' },
  {key: 'quality', title: 'Quality', href: paths.dashboard.quality, icon: 'star' },
  {key: 'warehouse', title: 'Warehouse', href: paths.dashboard.warehouse, icon: 'warehouse' },


  {key: 'withdrawal', title: 'Withdrawal',  icon: 'withdrawal',   children: [
      { key: 'requests', title: 'Requests', href: paths.dashboard.requests, icon: 'Wallet' },
      { key: 'accounts', title: 'Accounts', href: paths.dashboard.accounts, icon: 'bank' },
      // Add more child items as needed
    ]},

  {key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  {key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  
  //{key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];


//{key: 'customers', title: 'Customers', href: paths.dashboard.customers, icon: 'users' },
 // {key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },

  //{key: 'product', title: 'Product',  icon: 'product', children: [
  //    { key: 'category', title: 'Category', href: paths.dashboard.category, icon: 'category', matcher: { type: 'startsWith', href: paths.dashboard.category } },
  //    { key: 'brands', title: 'Brands', href: paths.dashboard.brands, icon: 'tags',  matcher: { type: 'startsWith', href: paths.dashboard.brands }},
  //    { key: 'attributes', title: 'Attributes', href: paths.dashboard.attributes, icon: 'attributes' ,  matcher: { type: 'startsWith', href: paths.dashboard.attributes } },
  //    { key: 'bundle_deals', title: 'Bundle Deals', href: paths.dashboard.bundleDeals, icon: 'cards',  matcher: { type: 'startsWith', href: paths.dashboard.bundleDeals } },
  //    { key: 'products', title: 'Product', href: paths.dashboard.products, icon: 'product' ,  matcher: { type: 'startsWith', href: paths.dashboard.products }},
  //  // Add more child items as needed
  //  ]},