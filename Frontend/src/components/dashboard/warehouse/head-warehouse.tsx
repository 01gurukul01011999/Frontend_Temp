"use client";
import React from 'react'
import { Box,Typography } from '@mui/material';

function HeadWarehouse(): React.JSX.Element {

         

  return (
    <>
   <Box sx={{ height: 50, mb: 0, mt: 0.5, ml:-3, mr:-3, backgroundColor: '#ffffff', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variant="h4" sx={{fontWeight: 600, ml:2}}>
        Warehouse
      </Typography>
     
      </Box>

      </>
  )
}

export default HeadWarehouse
