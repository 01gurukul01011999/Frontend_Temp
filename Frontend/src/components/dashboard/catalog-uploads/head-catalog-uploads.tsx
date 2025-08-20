"use client";
import React from 'react'
import Image from 'next/image';
import { Box, Button, Typography } from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
dayjs.extend(relativeTime);
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

function HeadCatalogUploads(): React.JSX.Element {
   const [learnOpen, setLearnOpen] = React.useState(false);
   const [search, setSearch] = React.useState('');
  
         

  return (
    <>
   <Box sx={{ mb: 0, mt: 0.5, ml:-3, mr:-3, backgroundColor: '#ffffff', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variant="h4" sx={{fontWeight: 600, ml:2}}>
        Catalog Uploads
      </Typography>
      <Box sx={{ display: 'flex', gap: 2,  mr:3 }}>
        
        <Button
          variant="text"
          color="inherit"
          onClick={() => setLearnOpen(true)}
          sx={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 , fontSize: '0.7rem' }}
          
        >
          <Image src={'/assets/youtube.svg'} alt="YTLOGO" width={20} height={20}  /> How it works?

        </Button>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <TextField
              size="small"
              placeholder="Search SKU ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 200, maxWidth: 400, ml: 'auto' }}
            />
          </Box>
       
      </Box>
      </Box>

       {/* Learn Dialog with YouTube embed */}
      <Dialog open={learnOpen} onClose={() => setLearnOpen(false)} maxWidth="md" fullWidth scroll="body" PaperProps={{ sx: { overflow: 'hidden' } }}>
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          <IconButton
            aria-label="close"
            onClick={() => setLearnOpen(false)}
            sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
          >
            <span className="material-icons" style={{ fontSize: 24 }}>X</span>
          </IconButton>
          <Typography variant="h6" sx={{ mb: 2 }}>How to Process Your Orders</Typography>
          <Box sx={{ width: '100%', maxWidth: 800, height: 0, paddingBottom: '56.25%', position: 'relative', mb: 0 }}>
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="How to Process Orders"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: 5 }}
            />
          </Box>
        </Box>
      </Dialog>
      </>
  )
}

export default HeadCatalogUploads