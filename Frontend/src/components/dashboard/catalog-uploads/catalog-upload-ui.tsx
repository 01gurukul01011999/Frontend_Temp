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
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { UserContext } from '@/contexts/user-context';
import NoCatalogSVG from './no-catalog-svg';

export default function CatalogUploadUI(): React.JSX.Element {
  const [tabValue, setTabValue] = useState(0); // 0 = Bulk, 1 = Single
  const [subTab, setSubTab] = useState(0); // Index for sub-tabs
  const [tabValuef, setTabValuef] = React.useState(0);
  const [imagePopup, setImagePopup] = useState(false);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null); // Track selected row
  console.log('selectedRow', selectedRow);
  const [catalog, setCatalog] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  console.log('catalog', catalog);
  console.log('loading', loading);
  console.log('error', error);

    const userContext = React.useContext(UserContext);
    const user = userContext?.user;

  type RowData = {
    id: number;
    image: string;
    category_path: string[];
    catalog_id: string;
    created_at: string;
    product_forms: { OtherAttributes?: { image_urls?: string[] } }[];
    QC_status: string;
    qcColor: string;
    
    action: string;
  };

  

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

 const rows = catalog as RowData[]; 
React.useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/fetch-catalogs';
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user ? { userId: user.id } : {}),
        });

        if (!res.ok) throw new Error('Failed to fetch categories');
        if (res.status === 204) {
          setError('No Order Found');
         
          return;
        }
        const data = await res.json();
        console.log('data', data);
        setCatalog(data);
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







  //  const rows = [
  //{
  //  id: 1,
  //  image: '/piano.jpg',
  //  category: 'Digital Pianos',
  //  fileId: '1731603007228-2027617-14810-IN',
  //  created: '14 Nov \'24 | 10:20 PM',
  //  products: 1,
  //  qcStatus: 'QC Error',
  //  qcColor: 'error',
  //  action: 'View in Inventory',
  //},
  //{
  //  id: 2,
  //  image: '/piano.jpg',
  //  category: 'Digital Pianos',
  //  fileId: '1731602395606-2027617-14810-IN',
  //  created: '14 Nov \'24 | 10:09 PM',
  //  products: 1,
  //  qcStatus: 'QC Error',
  //  qcColor: 'error',
  //  action: 'View in Inventory',
  //},
  //{
  //  id: 3,
  //  image: '/keyboard.jpg',
  //  category: 'Digital Pianos',
  //  fileId: '1731560192171-2027617-14810-IN',
  //  created: '14 Nov \'24 | 10:26 AM',
  //  products: 1,
  //  qcStatus: 'QC Pass',
  //  qcColor: 'success',
  //  action: 'View Catalog',
  //},
  //{
  //  id: 4,
  //  image: '/projector.jpg',
  //  category: 'Projector Accessories',
  //  fileId: '1731474698547-2027617-13448-IN',
  //  created: '13 Nov \'24 | 10:41 AM',
  //  products: 1,
  //  qcStatus: 'QC Pass',
  //  qcColor: 'success',
  //  action: 'View Catalog',
  //},
  //];



console.log('rows', rows);

  function formatIsoDate(iso?: string | null): string {
   // if (!iso) return '';
   // try {
   //   const d = new Date(iso);
   //   return d.toLocaleString(undefined, {
   //     year: 'numeric',
   //     month: 'short',
   //     day: 'numeric',
   //     hour: '2-digit',
   //     minute: '2-digit',
   //   });
   // } catch {
   //   return iso;
   // }
  if (!iso) return '';
   try {
     const d = new Date(iso);
     const day = String(d.getDate()).padStart(2, '0');
     const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
     const month = months[d.getMonth()];
    const year = String(d.getFullYear()).slice(-2);
      let hours = d.getHours();
     const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
   const hourStr = String(hours).padStart(2, '0');
   return `${day} ${month} '${year} | ${hourStr}:${minutes} ${ampm}`;
   } 
  catch {
          return iso;
   }
}

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
       <NoCatalogSVG />
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
              <TableCell>{index + 1}</TableCell>
              {/*<TableCell>
                {JSON.stringify(row.product_forms?.[0]?.OtherAttributes?.image_ids) || 'No image IDs'}
              </TableCell>*/}
              {/* Catalog Image with Play icon */}
              <TableCell>
                <Box sx={{ position: 'relative', width: 60, height: 60 }}>
                  <Avatar
                    variant="rounded"
                    src={row.product_forms?.[0]?.OtherAttributes?.image_urls?.[0]}
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

              <TableCell>{Array.isArray(row.category_path) && row.category_path.length > 3 ? row.category_path[3] : row.category_path?.join(' > ') || 'No category'}</TableCell>
              <TableCell>{row.catalog_id}</TableCell>
              <TableCell>{ formatIsoDate(row.created_at)}</TableCell>
              <TableCell>{Array.isArray(row.product_forms) ? row.product_forms.length : 0}</TableCell>

              <TableCell>
                <Chip
                  label={row.QC_status === 'notyet' ? 'Draft' : row.QC_status === 'inprogress' ? 'QC in Progress' : row.QC_status === 'pass' ? 'QC Pass' : row.QC_status === 'error' ? 'QC Error' : row.QC_status === 'action' ? 'Action Required' : row.QC_status}
                  color={row.qcColor === 'success' ? 'success' : (row.QC_status=="pending")?'info':(row.QC_status=="notyet")?'info':(row.QC_status=="error")?'error':(row.QC_status=="draft")?'warning':(row.QC_status=="pass")?'success':(row.QC_status=="action")?'error':(row.QC_status=="inprogress")?'info':(row.QC_status=="error")?'error':(row.QC_status=="error")?'error':(row.QC_status=="error")?'error':(row.QC_status=="error")?'error':(row.QC_status=="error")?'error':(row.QC_status=="error")?'error':(row.QC_status=="error")?'error':(row.QC_status=="error")?'error':(row.QC_status=="error")?'error':(row.QC_status=="error")?'error':(row.QC_status=="error")?'error':'default'} 
                  size="small"
                  icon={
                    row.qcColor === 'success' ? undefined : (
                      <WarningAmberIcon sx={{ color: '#f44336', fontSize: 16 }} />
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
                src={selectedRow.product_forms?.[0]?.OtherAttributes?.image_urls?.[0]}
                sx={{ width: 60, height: 60, border: '2px solid #5b3cc4' }}
              />
              <Box component="img"
                src={selectedRow.product_forms?.[0]?.OtherAttributes?.image_urls?.[0]}
                alt="Product"
                sx={{ width: "100%", maxHeight: 300, objectFit: "contain" }}
              />
            </Stack>

            <Box mt={3}>
              <Box display="flex" mb={1}>
                <Typography variant="body2" color="textSecondary" width={140}>Category</Typography>
                <Typography fontWeight="medium">{ Array.isArray(selectedRow.category_path) && selectedRow.category_path.length > 3 ? selectedRow.category_path[3] : selectedRow.category_path?.join(' > ') || 'No category'} </Typography>
              </Box>
              <Box display="flex" mb={1}>
                <Typography variant="body2" color="textSecondary" width={140}>File Id</Typography>
                <Typography>{selectedRow.catalog_id}</Typography>
              </Box>
              <Box display="flex" mb={1}>
                <Typography variant="body2" color="textSecondary" width={140}>Created At</Typography>
                <Typography fontWeight="medium">{ formatIsoDate(selectedRow.created_at)}</Typography>
              </Box>
              <Box display="flex">
                <Typography variant="body2" color="textSecondary" width={140}>No. of Products</Typography>
                <Typography>{Array.isArray(selectedRow.product_forms) ? selectedRow.product_forms.length : 0}</Typography>
              </Box>
            </Box>
          </Box>
        )}

        {selectedRow && tabValuef === 1 && (
          <Box mt={2}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Avatar
                variant="rounded"
                src={selectedRow.product_forms?.[0]?.OtherAttributes?.image_urls?.[0]}
                sx={{ width: 60, height: 60, border: '2px solid #5b3cc4' }}
              />
              <Box component="img"
                src={selectedRow.product_forms?.[0]?.OtherAttributes?.image_urls?.[0]}
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
