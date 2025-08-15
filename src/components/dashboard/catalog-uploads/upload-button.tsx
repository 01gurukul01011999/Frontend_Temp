"use client";
import React from 'react'
import {
  Box,
  Button,
  Typography,
  Stack,
  Paper,
} from '@mui/material';
function UploadButton(): React.JSX.Element {
  return (
   <Box sx={{ p: 3, backgroundColor: '#ffff', mr: -3, ml: -3 , mt: 1, mb: 1 }}>
        <Typography variant="subtitle1" color='' sx={{ mb: 2, }}>
          Have unique products to sell? Choose from the options below
        </Typography>
      {/* Action Buttons */}
      <Stack direction="row" spacing={2} mb={1}>
        
        <Button
          variant="contained"
          sx={{ backgroundColor: '#4d0aff' }}
          onClick={() => { globalThis.location.href = '/dashboard/catalog-uploads/bulk-catalog-upload'; }}
        >
          Add Catalog in Bulk
        </Button>
        <Button variant="outlined" sx={{ color: '#4d0aff', borderColor: '#4d0aff' }}
        onClick={() => { globalThis.location.href = '/dashboard/catalog-uploads/single-catalog-upload'; }}
        >
          Add Single Catalog
        </Button>
      </Stack>

      {/* Overview */}
      <Paper elevation={1} sx={{ display: 'flex', gap: 6, p: 3, mb: 0.5, maxWidth:500, border: '1px solid #e0e0e0', borderRadius: 2 }}>
        <Box>
          <Typography variant="body2" color="text.secondary">
            Total Uploads Done
          </Typography>
          <Typography variant="h6" fontWeight="bold" color="primary">
            194
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            Using Bulk Uploads
          </Typography>
          <Typography variant="h6" fontWeight="bold">0</Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            Using Single Uploads
          </Typography>
          <Typography variant="h6" fontWeight="bold">194</Typography>
        </Box>
      </Paper>
      </Box>
   
  )
}

export default UploadButton