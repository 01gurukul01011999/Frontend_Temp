'use client';
import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Tabs,
  Tab,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
  Alert,
  Stack,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
} from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

export default function CatalogUploadUI(): React.JSX.Element {

  type RowData = {
    id: number;
    image: string;
    category: string;
    fileId: string;
    created: string;
    products: number;
    qcStatus: string;
    qcColor: string;
    action: string;
  };

  const [tabValue, setTabValue] = useState(0); // 0 = Bulk, 1 = Single
  const [subTab, setSubTab] = useState(0); // Index for sub-tabs
  const [tabValuef, setTabValuef] = React.useState(0);
  const [imagePopup, setImagePopup] = useState(false);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null); // Track selected row

  // Add onClose handler
  const onClose = () => {
    setImagePopup(false);
    setSelectedRow(null);
  };

  const handleTabChangef = (_: React.SyntheticEvent, newValue: number) => {
    setTabValuef(newValue);
  };



  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSubTab(0);
  };
   const handleSubTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSubTab(newValue);
  };

  // Only show "Draft" sub tab for Single Uploads (tabValue === 1)
  const subTabs = tabValue === 0
    ? ['All', 'Action Required (30)', 'QC in Progress (1)', 'QC Error (19)', 'QC Pass (144)']
    : ['All', 'Action Required (30)', 'QC in Progress (1)', 'QC Error (19)', 'QC Pass (144)', 'Draft (30)'];

const rows = [
  {
    id: 1,
    image: '/piano.jpg',
    category: 'Digital Pianos',
    fileId: '1731603007228-2027617-14810-IN',
    created: '14 Nov \'24 | 10:20 PM',
    products: 1,
    qcStatus: 'QC Error',
    qcColor: 'error',
    action: 'View in Inventory',
  },
  {
    id: 2,
    image: '/piano.jpg',
    category: 'Digital Pianos',
    fileId: '1731602395606-2027617-14810-IN',
    created: '14 Nov \'24 | 10:09 PM',
    products: 1,
    qcStatus: 'QC Error',
    qcColor: 'error',
    action: 'View in Inventory',
  },
  {
    id: 3,
    image: '/keyboard.jpg',
    category: 'Digital Pianos',
    fileId: '1731560192171-2027617-14810-IN',
    created: '14 Nov \'24 | 10:26 AM',
    products: 1,
    qcStatus: 'QC Pass',
    qcColor: 'success',
    action: 'View Catalog',
  },
  {
    id: 4,
    image: '/projector.jpg',
    category: 'Projector Accessories',
    fileId: '1731474698547-2027617-13448-IN',
    created: '13 Nov \'24 | 10:41 AM',
    products: 1,
    qcStatus: 'QC Pass',
    qcColor: 'success',
    action: 'View Catalog',
  },
];





  return (<>
    <Box sx={{ p: 3, backgroundColor: '#ffff', mr: -3, ml: -3 , mt: 1}}>
      {/* Tabs */}
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Bulk Uploads (0)" />
        <Tab label="Single Uploads (194)" />
      </Tabs>
      <Tabs value={subTab} onChange={handleSubTabChange} variant="scrollable" scrollButtons="auto" sx={{ mb: 3 }}>
        {subTabs.map((label, index) => (
          <Tab key={index} label={label} />
        ))}
      </Tabs>

      {/* Filters */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="flex-end"
        alignItems="center"
      >
        <FormControl sx={{ minWidth: 200, mr: 'auto' }} size="small">
          <InputLabel>Select Category</InputLabel>
          <Select label="Select Category" defaultValue="">
            <MenuItem value="">All</MenuItem>
            <MenuItem value="clothing">Clothing</MenuItem>
            <MenuItem value="home">Home</MenuItem>
          </Select>
        </FormControl>

        <TextField label="Search By File Id" variant="outlined" size="small" />
      </Stack>

     
    </Box>
 {/* Bottom Info */}
      <Alert severity="info" sx={{  mr: -3, ml: -3, backgroundColor: '#fffbe6', border: '1px solid #ffe58f', color: '#664d03', mt:0.5 }}>
        💡 QC (Quality-Check) error products can now be fixed as they appear. Try to fix QC errors faster to speed up your catalog creation process.
      </Alert>
      {rows.length <= 0 && (
    <Box sx={{ p: 15, backgroundColor: '#fff', mr: -3, ml: -3 , mt: 0.5, textAlign: 'center' }}>
       <svg
    width={70}
    height={90}

    viewBox="0 0 111 142"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="css-0"
  >
    <g
      opacity=".8"
      clipPath="url(#clip0_3_52187)"
      style={{ mixBlendMode: "luminosity" }}
    >
      <path
        d="M70.851 33.745h-.78V12.37a12.37 12.37 0 00-3.626-8.748A12.383 12.383 0 0057.692 0H12.379A12.386 12.386 0 00.942 7.637C.32 9.137 0 10.747 0 12.37v117.258a12.358 12.358 0 003.626 8.748A12.378 12.378 0 0012.379 142h45.313c3.283 0 6.431-1.303 8.753-3.623a12.368 12.368 0 003.625-8.748v-80.67h.781V33.744z"
        fill="#E6E6E6"
      />
      <path
        d="M58.191 3.218h-5.914a4.386 4.386 0 01-2.002 5.532 4.394 4.394 0 01-2.065.515H22.251a4.394 4.394 0 01-4.369-3.941c-.073-.716.03-1.44.303-2.106H12.66a9.247 9.247 0 00-6.536 2.706 9.235 9.235 0 00-2.708 6.533v117.086c0 2.451.974 4.8 2.708 6.533a9.25 9.25 0 006.536 2.706h45.531a9.237 9.237 0 003.538-.704 9.237 9.237 0 005.707-8.535V12.457a9.232 9.232 0 00-5.707-8.535 9.25 9.25 0 00-3.538-.704z"
        fill="#fff"
      />
      <path
        d="M63.678 95.181H9.085a1.012 1.012 0 01-1.01-1.01V80.637a1.011 1.011 0 011.01-1.01h54.593a1.013 1.013 0 011.011 1.01v13.534a1.011 1.011 0 01-1.01 1.01zM9.085 80.031a.607.607 0 00-.606.606v13.534a.606.606 0 00.606.606h54.593a.607.607 0 00.607-.606V80.637a.606.606 0 00-.606-.606H9.084z"
        fill="#E6E6E6"
      />
      <path
        d="M16.162 91.647c2.345 0 4.246-1.9 4.246-4.243a4.245 4.245 0 00-4.246-4.244 4.245 4.245 0 00-4.246 4.244 4.245 4.245 0 004.246 4.243zm9.806-7.072a.708.708 0 000 1.414h33.363a.708.708 0 10.027-1.414h-33.39zm0 4.243a.708.708 0 000 1.415h33.363a.708.708 0 100-1.415H25.968zm37.71 28.994H9.085a1.014 1.014 0 01-1.01-1.011v-13.533a1.01 1.01 0 011.01-1.01h54.593a1.013 1.013 0 011.011 1.01v13.533a1.01 1.01 0 01-1.01 1.011zm-54.593-15.15a.609.609 0 00-.606.606v13.533a.608.608 0 00.606.607h54.593a.605.605 0 00.607-.607v-13.533a.608.608 0 00-.606-.606H9.084z"
        fill="#E6E6E6"
      />
      <path
        d="M16.162 114.279a4.245 4.245 0 100-8.487 4.245 4.245 0 00-4.246 4.243 4.245 4.245 0 004.246 4.244zm9.806-7.073a.705.705 0 00-.695.708.71.71 0 00.695.707h33.363a.708.708 0 00.023-1.415H25.968zm0 4.244a.709.709 0 00-.492 1.203c.13.132.307.208.492.211h33.363a.708.708 0 00.023-1.414H25.968zm9.265-44.353a19.206 19.206 0 01-13.58-5.614 19.182 19.182 0 01-5.629-13.566V47.9c0-.04 0-.083.003-.123.058-10.512 8.675-19.073 19.206-19.073a19.21 19.21 0 0113.583 5.62 19.19 19.19 0 01.003 27.148 19.215 19.215 0 01-13.582 5.624h-.004zm0-37.989a18.85 18.85 0 00-13.245 5.478 18.826 18.826 0 00-5.557 13.204c-.002.043-.002.078-.002.11a18.79 18.79 0 003.168 10.442 18.818 18.818 0 0028.935 2.852 18.79 18.79 0 004.08-20.482 18.797 18.797 0 00-6.926-8.435 18.814 18.814 0 00-10.448-3.169h-.005z"
        fill="#E6E6E6"
      />
      <path
        d="M61.523 90.307a7.807 7.807 0 007.81-7.805 7.807 7.807 0 00-7.81-7.804 7.807 7.807 0 00-7.81 7.805 7.807 7.807 0 007.81 7.804z"
        fill="#fff"
      />
      <path
        d="M58.811 86.015h-4.238a2.03 2.03 0 01-1.415-3.451c.373-.38.88-.598 1.413-.607h4.267A2.03 2.03 0 0160.84 84a2.029 2.029 0 01-2.029 2.016z"
        fill="#6C63FF"
      />
      <path d="M110.781 141.525h-47.26v.437h47.26v-.437z" fill="#3F3D56" />
      <path
        d="M67.419 104.529a1.257 1.257 0 01-.123-.246l-1.008-2.697a1.27 1.27 0 01.745-1.632l22.5-8.396a1.27 1.27 0 011.633.744L92.174 95a1.268 1.268 0 01-.745 1.632l-22.5 8.396a1.275 1.275 0 01-1.51-.499z"
        fill="#6C63FF"
      />
      <path
        d="M89.461 90.861l-9.15 3.646a1.171 1.171 0 00-.799 1.405l1.062 4.248a1.174 1.174 0 00.635.774c.156.075.327.113.5.113.173.001.344-.037.5-.111l9.176-4.316a1.173 1.173 0 00.688-1.505l-1.103-3.566a1.174 1.174 0 00-1.509-.688z"
        fill="#2F2E41"
      />
      <path
        d="M106.205 117.331a1.272 1.272 0 01-1.346-.847l-7.832-22.69a1.268 1.268 0 01.786-1.612l2.724-.94a1.273 1.273 0 011.614.786l7.832 22.69a1.27 1.27 0 01-.786 1.612l-2.724.939c-.087.03-.177.051-.268.062z"
        fill="#6C63FF"
      />
      <path
        d="M102.735 91.64l3.006 9.374a1.173 1.173 0 01-.577 1.51l-3.955 1.884a1.167 1.167 0 01-1.407-.311 1.167 1.167 0 01-.233-.457l-2.505-9.82a1.172 1.172 0 01.725-1.488l3.455-1.418a1.173 1.173 0 011.491.726zm-9.101 50.014h-2.882a1.273 1.273 0 01-1.269-1.268v-24.002a1.27 1.27 0 011.27-1.269h2.881a1.273 1.273 0 011.27 1.269v24.002a1.269 1.269 0 01-1.27 1.268zm5.699 0h-2.881a1.273 1.273 0 01-1.27-1.268v-24.002a1.27 1.27 0 011.27-1.269h2.881a1.271 1.271 0 011.269 1.269v24.002a1.267 1.267 0 01-1.269 1.268z"
        fill="#2F2E41"
      />
      <path
        d="M101.708 119.205H88.615a1.367 1.367 0 01-1.367-1.366V96.583c0-2.098.834-4.11 2.318-5.592a7.916 7.916 0 0113.509 5.592v21.256a1.367 1.367 0 01-1.367 1.366z"
        fill="#CCC"
      />
      <path
        d="M103.679 124.404h-6.638V86.912l.123.034a8.86 8.86 0 016.515 8.524v28.934zm-10.936 0h-6.638V95.47a8.85 8.85 0 016.514-8.524l.124-.034v37.492z"
        fill="#2F2E41"
      />
      <path
        d="M95.063 84.278c5.77 0 10.449-4.676 10.449-10.443 0-5.767-4.679-10.442-10.45-10.442-5.77 0-10.449 4.675-10.449 10.442s4.678 10.443 10.45 10.443z"
        fill="#6C63FF"
      />
      <path
        d="M106.877 71.431s.585-16.194-7.03-10.926c0 0-4.392-14.731-15.13 7.317l-3.124 3.121s14.057-1.95 27.138 4.098l-1.854-3.61z"
        fill="#2F2E41"
      />
      <path
        d="M95.222 79.007c-.645-.018-1.448-.04-2.067-.492a1.587 1.587 0 01-.625-1.185 1.067 1.067 0 01.363-.877c.323-.273.795-.337 1.304-.187l-.527-3.849.387-.053.62 4.525-.324-.148c-.374-.172-.888-.26-1.208.01a.685.685 0 00-.225.565 1.198 1.198 0 00.465.884c.482.351 1.122.397 1.848.417l-.01.39zm-3.466-6.258h-2.103v.39h2.103v-.39zm6.639 0h-2.103v.39h2.103v-.39z"
        fill="#2F2E41"
      />
      <path
        d="M71.765 105.523a1.174 1.174 0 01-1.556-.569l-6.738-14.513a1.17 1.17 0 011.465-1.592c.292.106.53.325.66.606l6.738 14.514a1.17 1.17 0 01-.57 1.554z"
        fill="#3F3D56"
      />
      <path
        d="M64.843 89.907a.782.782 0 01-.781-.78v-9.942H54.3a.782.782 0 010-1.56h10.543a.781.781 0 01.78.78v10.722a.78.78 0 01-.78.78z"
        fill="#6C63FF"
      />
      <path
        d="M65.028 91.01a9.377 9.377 0 01-10.29-1.602 9.365 9.365 0 01-2.455-10.113 9.366 9.366 0 018.41-6.137 9.376 9.376 0 018.892 5.415 9.37 9.37 0 01-4.557 12.438zm-6.903-14.867a7.027 7.027 0 00-4.064 6.665 7.022 7.022 0 004.606 6.303 7.033 7.033 0 007.59-1.84 7.023 7.023 0 001.202-7.712 7.035 7.035 0 00-9.334-3.416z"
        fill="#3F3D56"
      />
    </g>
    <defs>
      <clipPath id="clip0_3_52187">
        <path fill="#fff" d="M0 0h111v142H0z" />
      </clipPath>
    </defs>
  </svg>
  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
    No Results

  </Typography>
        
      <Typography variant="body2" sx={{ mb: 2 }}>
        No Bulk catalogs exist. Upload a new catalog using Bulk upload button on the top</Typography>
  </Box>)}
{rows.length >= 0 && (
<TableContainer component={Paper} elevation={1} sx={{mr: -3 , ml: -3, mt: 0.5, width: '1150px', borderRadius: 0}}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>S.no</strong></TableCell>
            <TableCell><strong>Catalog Image</strong></TableCell>
            <TableCell><strong>Category</strong></TableCell>
            <TableCell><strong>File Id</strong></TableCell>
            <TableCell><strong>Created Date</strong></TableCell>
            <TableCell><strong>Products</strong></TableCell>
            <TableCell><strong>QC Status</strong></TableCell>
            <TableCell><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.id}</TableCell>

              {/* Catalog Image with Play icon */}
              <TableCell>
                <Box sx={{ position: 'relative', width: 60, height: 60 }}>
                  <Avatar
                    variant="rounded"
                    src={row.image}
                    alt="catalog"
                    sx={{ width: 60, height: 60, cursor: 'pointer' }}
                    onClick={() => {
                      setSelectedRow(row);
                      setImagePopup(true);
                    }} // Open dialog on click
                  />
                  <PlayCircleOutlineIcon
                    sx={{
                      position: 'absolute',
                      bottom: 2,
                      left: 2,
                      background: '#fff',
                      borderRadius: '50%',
                      fontSize: 16,
                    }}
                  />
                </Box>
              </TableCell>

              <TableCell>{row.category}</TableCell>
              <TableCell>{row.fileId}</TableCell>
              <TableCell>{row.created}</TableCell>
              <TableCell>{row.products}</TableCell>

              {/* QC Status Chip */}
              <TableCell>
                <Chip
                  label={row.qcStatus}
                  color={row.qcColor as 'success' | 'error' | 'default' | 'primary' | 'secondary' | 'info' | 'warning'}
                  size="small"
                  icon={
                    row.qcColor === 'success' ? undefined : (
                      <span style={{ color: '#f44336' }}>⚠️</span>
                    )
                  }
                />
              </TableCell>

              {/* Actions */}
              <TableCell>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: '#4d0aff',
                    color: '#4d0aff',
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  {row.action}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

      )}
  

 <Dialog open={imagePopup} onClose={() => {}} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Product Details
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8, color: "#666" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Tabs value={tabValuef} onChange={handleTabChangef}>
          <Tab label="Images" />
          <Tab label="Description" />
        </Tabs>

        {selectedRow && tabValuef === 0 && (
          <Box mt={2}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Avatar
                variant="rounded"
                src={selectedRow.image}
                sx={{ width: 60, height: 60, border: '2px solid #5b3cc4' }}
              />
              <Box component="img"
                src={selectedRow.image}
                alt="Product"
                sx={{ width: "100%", maxHeight: 300, objectFit: "contain" }}
              />
            </Stack>

            <Box mt={3}>
              <Box display="flex" mb={1}>
                <Typography variant="body2" color="textSecondary" width={140}>Category</Typography>
                <Typography fontWeight="medium">{selectedRow.category}</Typography>
              </Box>
              <Box display="flex" mb={1}>
                <Typography variant="body2" color="textSecondary" width={140}>File Id</Typography>
                <Typography>{selectedRow.fileId}</Typography>
              </Box>
              <Box display="flex" mb={1}>
                <Typography variant="body2" color="textSecondary" width={140}>Created At</Typography>
                <Typography fontWeight="medium">{selectedRow.created}</Typography>
              </Box>
              <Box display="flex">
                <Typography variant="body2" color="textSecondary" width={140}>No. of Products</Typography>
                <Typography>{selectedRow.products}</Typography>
              </Box>
            </Box>
          </Box>
        )}

        {selectedRow && tabValuef === 1 && (
          <Box mt={2}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Avatar
                variant="rounded"
                src={selectedRow.image}
                sx={{ width: 60, height: 60, border: '2px solid #5b3cc4' }}
              />
              <Box component="img"
                src={selectedRow.image}
                alt="Product"
                sx={{ width: "100%", maxHeight: 300, objectFit: "contain" }}
              />
            </Stack>
            <Typography variant="body2">
              This is a detailed description of the product. You can add more structured content here.
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>


    </>
  );
}
