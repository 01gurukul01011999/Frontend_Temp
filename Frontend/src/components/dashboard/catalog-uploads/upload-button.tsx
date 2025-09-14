"use client";
import React from 'react'
import {
  Box,
  Button,
  Typography,
  Stack,
  Paper,
} from '@mui/material';
import { useAuth } from '@/modules/authentication';




function UploadButton(): React.JSX.Element {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [totaluploads, setTotaluploads] = React.useState<number>(0);
  const [bulkuploads, setBulkuploads] = React.useState<number>(0);
  const [singleuploads, setSingleuploads] = React.useState<number>(0);
  //console.log('Catalog:', catalog);
  //  console.log('Error:', error);
  //console.log('Loading:', loading);

  const { user } = useAuth();
   

React.useEffect(() => {
  if (!user || !user.id) return;

  const fetchCatalog = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/fetch-catalogs';
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        });

        if (!res.ok) throw new Error('Failed to fetch categories');
        if (res.status === 204) {
          setError('No Order Found');
          return;
        }
        const data = await res.json();
        setTotaluploads(data.length);
        setBulkuploads(data.filter((item: { trough: string }) => item.trough === 'bulk').length);
        setSingleuploads(data.filter((item: { trough: string }) => item.trough === 'single').length);
      } catch (error_: unknown) {
        if (error_ instanceof Error) {
          setError(error_.message || 'Error fetching categories');
        } else {
          setError('Error fetching categories');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, [user]);

         //console.log('Total Uploads:', totaluploads);
         //console.log('Bulk Uploads:', bulkuploads);
         //console.log('Single Uploads:', singleuploads);


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
            {totaluploads}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            Using Bulk Uploads
          </Typography>
          <Typography variant="h6" fontWeight="bold">{bulkuploads}</Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            Using Single Uploads
          </Typography>
          <Typography variant="h6" fontWeight="bold">{singleuploads}</Typography>
        </Box>
      </Paper>
      </Box>
   
  )
}

export default UploadButton