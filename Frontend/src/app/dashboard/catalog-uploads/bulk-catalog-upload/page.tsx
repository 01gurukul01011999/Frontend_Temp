import React from 'react';
import {
  Box
} from '@mui/material';
import CategorySelector from '@/components/dashboard/catalog-uploads/bulk/category-selector';
import Header from '@/components/dashboard/catalog-uploads/bulk/header';
import Footer from '@/components/dashboard/catalog-uploads/bulk/footer';

export default function page() : React.JSX.Element {
 
  return (
    <Box sx={{pt:0, pl: 5, pr:5, m: 0, backgroundColor: '#f4f7fb',  minWidth: '100vw', width: '100vw', height: '100vh', position: 'relative', zIndex: 1300, overflow:'auto'}}>
      <Header />
    <CategorySelector />
    <Footer />
     
      {/* Discard Button at Bottom Left */}
     
    </Box>
  );
}
