'use client';
import React, { useState, useRef } from 'react'

import { Box, Typography, Button, Popover, Divider } from '@mui/material';
import CheckCircle from '@mui/icons-material/CheckCircle';

function Claimstab(): React.JSX.Element {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [selectedRange, setSelectedRange] = useState<'30' | '90' | '180'>('30');

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (<>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', p: 1, boxShadow: 1, mt:0.5 , ml: -3, mr: -3}}>
      {/* Left side overview */}
      <Box sx={{ml:3}}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Claims Overview
        <Box component="span" sx={{ ml: 2 }}>
            <Button
                variant="text"
                sx={{ textTransform: 'none', fontWeight: 400 }}
                aria-haspopup="listbox"
                aria-label="Select date range"
                onClick={handlePopoverOpen}
                ref={buttonRef}
            >
                last {selectedRange} Days
            </Button>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
      <Box sx={{ p: 2 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <input
              type="radio"
              name="dateRange"
              value="30"
              checked={selectedRange === '30'}
              onChange={() => setSelectedRange('30')}
            />
            Last 30 Days
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <input
              type="radio"
              name="dateRange"
              value="90"
              checked={selectedRange === '90'}
              onChange={() => setSelectedRange('90')}
            />
            Last 90 Days
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="radio"
              name="dateRange"
              value="180"
              checked={selectedRange === '180'}
              onChange={() => setSelectedRange('180')}
            />
            Last 180 Days
          </label>

      </Box>
          </Popover>
            
            
        </Box></Typography>
       
      </Box>
      {/* Right side button */}
      <Button variant="contained" color="primary" size="large" sx={{ mr: 3, height: 35, fontSize: '0.75rem' }}>
      +  Raise Claims
      </Button>

    </Box>
  
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, backgroundColor: '#fff', ml: -3, mr: -3, mt: 0, p: 3,  boxShadow: 2 }}>
        {/* Left Section */}
        <Box sx={{ flex: 1, pr: { md: 4 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'grey.800', mb: 1 }}>
             Raising claims is super-easy on <Box component="span" sx={{ fontWeight: 'bold', display: 'inline' }}>Techpotli</Box>
          </Typography>
          <Divider sx={{ my: 2, mr: 6, maxWidth: 320 }} />
          <Box component="ul" sx={{ mt: 1, mb: 2, pl: 0, listStyle: 'none' }}>
            <Box component="li" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CheckCircle sx={{ color: 'success.main', mr: 1 }} fontSize="medium" />
              <Typography variant="body1">Cut down on losses due to wrong returns</Typography>
            </Box>
            <Box component="li" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CheckCircle sx={{ color: 'success.main', mr: 1 }} fontSize="medium" />
              <Typography variant="body1">Transparent resolution process</Typography>
            </Box>
            <Box component="li" sx={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircle sx={{ color: 'success.main', mr: 1 }} fontSize="medium" />
              <Typography variant="body1">Upto 100% Claim Approval Rate <Box component="span" sx={{ fontSize: '0.8rem', color: 'grey.500', ml: 0.5 }}>*</Box></Typography>
            </Box>
          </Box>
          <Button variant="contained" color="primary" sx={{ mt: 2, px: 4, py: 1, fontWeight: 500, fontSize: '0.95rem', borderRadius: 1 }}>
            + Raise Claim
          </Button>
          <Typography variant="caption" sx={{ color: 'grey.500', mt: 2 }}>*Applicable only on genuine claims</Typography>
        </Box>
        {/* Right Section - YouTube Video */}
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ position: 'relative', width: '100%', maxWidth: 420, aspectRatio: '16/9', borderRadius: 2, overflow: 'hidden', boxShadow: 1 }}>
            <iframe
              style={{ border: 0, borderRadius: '8px', width: '100%', height: '100%' }}
              src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
              title="Video Guidelines - Unboxing"
              allowFullScreen
            ></iframe>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Claimstab