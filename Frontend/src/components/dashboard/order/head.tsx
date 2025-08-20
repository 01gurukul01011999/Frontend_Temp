"use client";
import React from 'react'
import { CaretDownIcon } from '@phosphor-icons/react/dist/ssr/CaretDown';
import { MicrosoftExcelLogoIcon } from '@phosphor-icons/react/dist/ssr/MicrosoftExcelLogo';
import {CalendarBlankIcon} from '@phosphor-icons/react/dist/ssr/CalendarBlank';
import { ArrowLineDownIcon, ExclamationMarkIcon } from '@phosphor-icons/react';
import Image from 'next/image';
import { Box, Button, Popover, Typography, Divider, TextField, Dialog, IconButton } from '@mui/material';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);


function handleDownload(format: 'csv' | 'excel') {
  // TODO: Implement actual download logic
  // For now, just show a toast
  toast.info(`Download as ${format.toUpperCase()} coming soon!`);
}

function Head(): React.JSX.Element {
  const [anchorE2, setAnchorE2] = React.useState<null | HTMLElement>(null);
  const [learnOpen, setLearnOpen] = React.useState(false);
  const [downloadAnchorEl, setDownloadAnchorEl] = React.useState<null | HTMLElement>(null);
  const [startDate, setStartDate] = React.useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = React.useState<dayjs.Dayjs | null>(null);
  const open2 = Boolean(anchorE2);
  const handleDateClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorE2(event.currentTarget);
  };
  const handleDateClose = () => {
    setAnchorE2(null);
  };

  return (
    <>
    <Box sx={{ mb: 0, mt: 0.5, ml:-3, mr:-3, backgroundColor: '#ffffff', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variant="h4" sx={{fontWeight: 600, ml:2}}>
        Orders
      </Typography>
      <Box sx={{ display: 'flex', gap: 2,  mr:3 }}>
        
        <Button
          variant="text"
          color="inherit"
          onClick={() => setLearnOpen(true)}
          sx={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 , fontSize: '0.7rem' }}
          
        >
          <Image src={'/assets/youtube.svg'} alt="YTLOGO" width={20} height={20}  /> Learn how to process your orders?
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={e => setDownloadAnchorEl(e.currentTarget)}
          sx={{ padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <MicrosoftExcelLogoIcon size={25} />Download Orders Data <CaretDownIcon size={20} />
        </Button>
        <Popover
          open={Boolean(downloadAnchorEl)}
          anchorEl={downloadAnchorEl}
          onClose={() => setDownloadAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Box sx={{ p: 2, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 1, maxWidth: 500 }}>
            <Box sx={{ display: 'flex', gap: 2,  mr:3, border: '1px solid #323232', padding: '8px', borderRadius: '8px', backgroundColor: '#e3e3e3', width: '100%'   }}>
            <Box sx={{ borderRadius: '50%', backgroundColor: '#8a8888', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 60, height: 40 }}>
                <ExclamationMarkIcon size={20} color='white'/>
              </Box>
            <Box >
              <Typography variant="body2" color='subtitle1' sx={{ mb: -0.6, }}>
              
              Download Orders data here. For tax invoice, please use the Downloads option in Payments tab
              </Typography>
              </Box>
              
            </Box>
            <Box sx={{ display: 'flex', gap: 2,  mr:3 }}>
            <Box >
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: -0.6, }}>
              Download Orders Data
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.7rem' }}>
              It might take some time to generate the file
            </Typography>
            </Box>
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>  <Button onClick={handleDateClick} size="small" variant="text" sx={{ minWidth: 110 }}>
                <CalendarBlankIcon size={25} /> Select Date Range
              </Button>
              <Popover
                open={open2}
                anchorEl={anchorE2}
                onClose={handleDateClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                sx={{ boxShadow: 3 }}
              >
<Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 220 }}>
                  <TextField
                    label="Start Date (YYYY-MM-DD)"
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={startDate ? startDate.format('YYYY-MM-DD') : ''}
                    onChange={e => setStartDate(e.target.value ? dayjs(e.target.value) : null)}
                  />
                  <TextField
                    label="End Date (YYYY-MM-DD)"
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={endDate ? endDate.format('YYYY-MM-DD') : ''}
                    onChange={e => setEndDate(e.target.value ? dayjs(e.target.value) : null)}
                  />
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleDateClose}
                    >
                      Download
                    </Button>
                  </Box>
                </Box>
              </Popover>
              </Box>
           
            </Box>

         <Divider sx={{ my: 0 }} />
         <Typography variant="subtitle1" color='text.secondary'  sx={{ mb:0 }}>
             EXPORTED FILES
            </Typography>
            <Box sx={{ display: 'flex', gap: 3,  mr:3 }}>
              <Box>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: -0.6 }}>
                  File Name
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.7rem' }}>
                  10 july 2025, 07:00 AM
                </Typography>
              </Box>
              <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <Button onClick={() => { handleDownload('excel'); setDownloadAnchorEl(null); }} size="small" variant="text" sx={{ minWidth: 110 }}>
                  <ArrowLineDownIcon size={20} /> Download
                </Button>
              </Box>
            </Box>
         
            
          </Box>
        </Popover>
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

export default Head