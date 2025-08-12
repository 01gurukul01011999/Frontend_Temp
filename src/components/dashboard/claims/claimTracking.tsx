'use client';
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Menu,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Popover,
  TextField,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import dayjs from 'dayjs';

const claimsData = [
  {
    product: {
      name: 'Fibtech Car Charger',
      sku: 'car charger',
      qty: 1,
      size: 'Free Size',
      image: '/car-charger.png',
    },
    date: '28 Nov’24',
    suborderId: '8160040914 5173696_1',
    issue: 'I have received damaged return',
    status: 'Rejected',
    ticketId: '8732799822707',
    update: 'View More',
  },
  {
    product: {
      name: 'LEARNING PIANO 37 KEY',
      sku: 'LEARNING PIANO 37 KEY',
      qty: 1,
      size: 'Free Size',
      image: '/piano.png',
    },
    date: '28 Nov’24',
    suborderId: '8503321670 1884096_1',
    issue: 'I have received damaged return',
    status: 'Approved',
    ticketId: '8732799792668',
    update:
      'Your claim payment of Rs 231.81 for this order was done on 02 Dec 2024 with a transaction id: ING0N2',
  },
];


function ClaimTracking() {
  const [tab, setTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [dispatchAnchorEl, setDispatchAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [slaStatusAnchorEl, setSlaStatusAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [slaStatus, setSlaStatus] = useState<string[]>([]);
  const [dispatchStartDate, setDispatchStartDate] = useState<any>(null);
  const [dispatchEndDate, setDispatchEndDate] = useState<any>(null);
  const [orderAnchorEl, setOrderAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [orderStartDate, setOrderStartDate] = useState<any>(null);
  const [orderEndDate, setOrderEndDate] = useState<any>(null);

  return (
     <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        mt: 1,
        p: 2,
        mr: -3,
        ml: -3,
      }}
    >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0 }}>
      <Typography variant="h4" sx={{ mb: 0 }}>
        Claim Tracking 

      </Typography>
         
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            Download
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => setAnchorEl(null)}>3/3 ready for download</MenuItem>
          </Menu>
        
      
      </Box>

      <Tabs value={tab} onChange={(e, newVal) => setTab(newVal)} sx={{ mb:0.5 }}>
        <Tab label="All (302)" />
        <Tab label="Open (0)" />
        <Tab label="Approved (186)" />
        <Tab label="Rejected (116)" />
      </Tabs>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                   {/* SLA Status Dropdown with checkboxes */}
                   <Typography variant="subtitle1" sx={{ fontWeight:400 }}>
                     Filter By:</Typography>
                   <Button
                     variant="outlined"
                     size="small"
                     sx={{ minWidth: 120 }}
                     onClick={e => setSlaStatusAnchorEl(e.currentTarget)}
                   >
                     SLA Status
                   </Button>
                   <Popover
                     open={Boolean(slaStatusAnchorEl)}
                     anchorEl={slaStatusAnchorEl}
                     onClose={() => setSlaStatusAnchorEl(null)}
                     anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                     PaperProps={{ sx: { minWidth: 220, p: 2 } }}
                   >
                     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                       <label style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                         <input
                           type="checkbox"
                           checked={slaStatus.includes('Breached')}
                           onChange={() => setSlaStatus(slaStatus.includes('Breached') ? slaStatus.filter(s => s !== 'Breached') : [...slaStatus, 'Breached'])}
                         />
                         Breached
                       </label>
                       <label style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                         <input
                           type="checkbox"
                           checked={slaStatus.includes('Breaching Soon')}
                           onChange={() => setSlaStatus(slaStatus.includes('Breaching Soon') ? slaStatus.filter(s => s !== 'Breaching Soon') : [...slaStatus, 'Breaching Soon'])}
                         />
                         Breaching Soon
                       </label>
                       <label style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                         <input
                           type="checkbox"
                           checked={slaStatus.includes('Others')}
                           onChange={() => setSlaStatus(slaStatus.includes('Others') ? slaStatus.filter(s => s !== 'Others') : [...slaStatus, 'Others'])}
                         />
                         Others
                       </label>
                       <Button size="small" onClick={() => setSlaStatus([])}>Clear</Button>
                     </Box>
                   </Popover>
                   {/* Dispatch Date Filter Button and Popover (for Pending tab) */}
                   <Button
                     variant="outlined"
                     size="small"
                     sx={{ minWidth: 120 }}
                     onClick={e => setDispatchAnchorEl(e.currentTarget)}
                   >
                     Dispatch Date
                   </Button>
                   <Popover
                     open={Boolean(dispatchAnchorEl)}
                     anchorEl={dispatchAnchorEl}
                     onClose={() => setDispatchAnchorEl(null)}
                     anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                     PaperProps={{ sx: { minWidth: 220, p: 2 } }}
                   >
                     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                       <TextField
                         type="date"
                         size="small"
                         label="Start Date"
                         InputLabelProps={{ shrink: true }}
                         value={dispatchStartDate ? dispatchStartDate.format('YYYY-MM-DD') : ''}
                         onChange={e => setDispatchStartDate(e.target.value ? dayjs(e.target.value) : null)}
                       />
                       <TextField
                         type="date"
                         size="small"
                         label="End Date"
                         InputLabelProps={{ shrink: true }}
                         value={dispatchEndDate ? dispatchEndDate.format('YYYY-MM-DD') : ''}
                         onChange={e => setDispatchEndDate(e.target.value ? dayjs(e.target.value) : null)}
                       />
                       <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                         <Button variant="outlined" size="small" onClick={() => { setDispatchStartDate(null); setDispatchEndDate(null); }}>Clear</Button>
                         <Button variant="contained" size="small" onClick={() => setDispatchAnchorEl(null)} disabled={!dispatchStartDate || !dispatchEndDate}>Apply</Button>
                       </Box>
                     </Box>
                   </Popover>
                   {/* Order Date Filter Button and Popover (for Pending tab) */}
                   <Button
                     variant="outlined"
                     size="small"
                     sx={{ minWidth: 120 }}
                     onClick={e => setOrderAnchorEl(e.currentTarget)}
                   >
                     Order Date
                   </Button>
                   <Popover
                     open={Boolean(orderAnchorEl)}
                     anchorEl={orderAnchorEl}
                     onClose={() => setOrderAnchorEl(null)}
                     anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                     PaperProps={{ sx: { minWidth: 220, p: 2 } }}
                   >
                     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                       <TextField
                         type="date"
                         size="small"
                         label="Start Date"
                         InputLabelProps={{ shrink: true }}
                         value={orderStartDate ? orderStartDate.format('YYYY-MM-DD') : ''}
                         onChange={e => setOrderStartDate(e.target.value ? dayjs(e.target.value) : null)}
                       />
                       <TextField
                         type="date"
                         size="small"
                         label="End Date"
                         InputLabelProps={{ shrink: true }}
                         value={orderEndDate ? orderEndDate.format('YYYY-MM-DD') : ''}
                         onChange={e => setOrderEndDate(e.target.value ? dayjs(e.target.value) : null)}
                       />
                       <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                         <Button variant="outlined" size="small" onClick={() => { setOrderStartDate(null); setOrderEndDate(null); }}>Clear</Button>
                         <Button variant="contained" size="small" onClick={() => setOrderAnchorEl(null)} disabled={!orderStartDate || !orderEndDate}>Apply</Button>
                       </Box>
                     </Box>
                   </Popover>
                 </Box>
       

      {/* Table */}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Product Details</TableCell>
            <TableCell>Created Date</TableCell>
            <TableCell>Suborder ID</TableCell>
            <TableCell>Issue</TableCell>
            <TableCell>Claim Status</TableCell>
            <TableCell>Last Updates</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {claimsData.map((item, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    style={{ width: 50, height: 50, marginRight: 8, borderRadius: 4 }}
                  />
                  <Box>
                    <Typography fontWeight={500}>{item.product.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      SKU ID: {item.product.sku}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Qty: {item.product.qty} | Size: {item.product.size}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.suborderId}</TableCell>
              <TableCell>{item.issue}</TableCell>
              <TableCell sx={{ color: item.status === 'Approved' ? 'green' : 'red' }}>
                {item.status}
              </TableCell>
              <TableCell>
                <Typography variant="body2">{item.update}</Typography>
              </TableCell>
              <TableCell>
                <IconButton>
                  <VisibilityIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}

export default ClaimTracking