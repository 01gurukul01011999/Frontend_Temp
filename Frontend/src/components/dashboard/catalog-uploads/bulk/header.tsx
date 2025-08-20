'use client';
import React from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  Dialog
} from '@mui/material';
import YouTubeIcon from '@mui/icons-material/YouTube';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import { CaretLeftIcon } from '@phosphor-icons/react';


export default function Header(): React.JSX.Element {
     const [learnOpen, setLearnOpen] = React.useState(false);
  return (
    <>
    {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, backgroundColor: '#ffffff', padding: '16px' }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <CaretLeftIcon size={28} onClick={() => globalThis.history.back()} style={{ cursor: 'pointer' }} />
          <Typography variant="h6" fontWeight="bold">
            Bulk Catalog Upload
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <YouTubeIcon
            sx={{ color: 'red', cursor: 'pointer' }}
            onClick={() => setLearnOpen(true)}
          />
          <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => setLearnOpen(true)}>
            How to upload catalogs in Bulk?
          </Typography>
        </Stack>
        {/* YouTube Popup */}
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



      </Box>
<Box sx={{ position: 'absolute', right: 0, marginRight: 8,  }}>
          <Button
            startIcon={<HeadsetMicIcon />}
            variant="outlined"
            size="small"
            sx={{
              textTransform: 'none',
              borderColor: '#4d0aff',
              color: '#4d0aff', 
              fontWeight: 600,
              backgroundColor: 'white',
            }}
          >
            Need Help?
          </Button>
        </Box>
      
    </>
  );
}