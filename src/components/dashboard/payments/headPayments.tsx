"use client";
import React from 'react'
import { Box, Button, Popover, Typography } from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
dayjs.extend(relativeTime);
import SearchIcon from '@mui/icons-material/Search';
import Download from '@mui/icons-material/Download';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';

function HeadPayments(): React.JSX.Element {
   const [learnOpen, setLearnOpen] = React.useState(false);
   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
   const openPopover = Boolean(anchorEl);
  // Download handler
 
         

  return (
    <>
      <Box sx={{ mb: 0, mt: 0.5, ml: -3, mr: -3, backgroundColor: '#ffffff', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4" sx={{ fontWeight: 600, ml: 2 }}>
          Payments
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mr: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            {/* Download Button */}
            <Box sx={{ position: "relative" }}>
              <Button
                variant="contained"
                startIcon={<Download />}
                endIcon={openPopover ? <ExpandLess /> : <ExpandMore />}
                sx={{
                  backgroundColor: "#2d2dff", // Deep blue
                  textTransform: "none",
                  px: 2.5,
                  fontWeight: "bold",
                  borderRadius: 1.5,
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "#1d1dde",
                  },
                }}
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                Download
              </Button>
              {/* Red Notification Dot */}
              <Box
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  width: 8,
                  height: 8,
                  bgcolor: "red",
                  borderRadius: "50%",
                }}
              />
              <Popover
                open={openPopover}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                PaperProps={{ sx: { minWidth: 240, p: 1 , width:250} }}
              >
                <Box>
                  <Button fullWidth sx={{ justifyContent: 'flex-start', textTransform: 'none', color: '#222', fontWeight: 500 }}>
                    GST Report
                  </Button>
                  <Button fullWidth sx={{ justifyContent: 'flex-start', textTransform: 'none', color: '#222', fontWeight: 500 }}>
                    Tax Invoice
                  </Button>
                  <Button fullWidth sx={{ justifyContent: 'flex-start', textTransform: 'none', color: '#222', fontWeight: 500 }}>
                    Supplier Tax Invoice <Box component="span" sx={{ ml: 1, color: 'primary.main', fontSize: 12, fontWeight: 700 }}>New</Box>
                  </Button>
                  <Button fullWidth sx={{ justifyContent: 'flex-start', textTransform: 'none', color: '#222', fontWeight: 500 }}>
                    Payments to Date <Box component="span" sx={{ ml: 1, color: 'primary.main', fontSize: 12, fontWeight: 700 }}>New</Box>
                  </Button>
                  <Button fullWidth sx={{ justifyContent: 'flex-start', textTransform: 'none', color: '#222', fontWeight: 500 }}>
                    Outstanding Payments
                  </Button>
                </Box>
              </Popover>
            </Box>
            {/* Grouped Dropdown and Search */}
           <Box
      sx={{
        display: "flex",
        alignItems: "center",
        border: "1px solid #ccc",
        borderRadius: "8px",
        overflow: "hidden",
        width: 450,
        height: 40,
      }}
    >
      {/* Dropdown (left) */}
      <Select
        defaultValue="Order / Sub Order No."
        variant="standard"
        disableUnderline
        sx={{
          flex: 1,
          pl: 1.5,
          fontSize: 14,
          borderRight: "1px solid #ccc",
          height: "100%",
        }}
      >
        <MenuItem value="Order / Sub Order No.">Order / Sub Order No.</MenuItem>
        <MenuItem value="Order ID">Order ID</MenuItem>
        <MenuItem value="Sub Order ID">Sub Order ID</MenuItem>
      </Select>

      {/* Search icon (right) */}
      <Box sx={{ px: 1.2 , width: 400,}}>
        <IconButton size="small">
          <SearchIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
          </Stack>
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

export default HeadPayments