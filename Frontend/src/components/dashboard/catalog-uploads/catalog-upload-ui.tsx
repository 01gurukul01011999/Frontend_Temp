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
  Skeleton,
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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import { UserContext } from '@/contexts/user-context';
import NoCatalogSVG from './no-catalog-svg';

export default function CatalogUploadUI(): React.JSX.Element {
  const [tabValue, setTabValue] = useState(0); // 0 = Bulk, 1 = Single
  const [subTab, setSubTab] = useState(0); // Index for sub-tabs
  const [tabValuef, setTabValuef] = React.useState(0);
  const [imagePopup, setImagePopup] = useState(false);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null); // Track selected row
  const [popupMainImage, setPopupMainImage] = React.useState<string | null>(null);
  //console.log('selectedRow', selectedRow);
  const [catalog, setCatalog] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [totaluploads, setTotaluploads] = React.useState<number>(0);
    const [bulkuploads, setBulkuploads] = React.useState<number>(0);
    const [singleuploads, setSingleuploads] = React.useState<number>(0);
    const [bulkqcProgress, setBulkQCprogress] = React.useState<number>(0);
    const [bulkqcError, setBulkQCerror] = React.useState<number>(0);
    const [bulkqcPass, setBulkQCpass] = React.useState<number>(0);
    const [bulkactionRequired, setBulkActionrequired] = React.useState<number>(0);
    const [singleqcProgress, setSingleQCprogress] = React.useState<number>(0);
    const [singleqcError, setSingleQCerror] = React.useState<number>(0);
    const [singleqcPass, setSingleQCpass] = React.useState<number>(0);
    const [singleactionRequired, setSingleActionrequired] = React.useState<number>(0);
    const [singledrafts, setSingleDrafts] = React.useState<number>(0);
    const [bulkData, setBulkData] = React.useState<any[]>([]);
    const [singleData, setSingleData] = React.useState<any[]>([]);
    // infinite-scroll: how many rows are currently visible (uses main window scroll)
    const [visibleCount, setVisibleCount] = React.useState<number>(10);
    const [loadingMore, setLoadingMore] = React.useState<boolean>(false);
  // search query for File Id
  const [searchQuery, setSearchQuery] = React.useState<string>('');
    // category filter (uses category_path[3])
    const [categoryFilter, setCategoryFilter] = React.useState<string>('');

 // console.log('catalog', catalog);
 // console.log('loading', loading);
  //console.log('error', error);

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
    trough?: string;
    action: string;
  };

  

  // Add onClose handler
  const onClose = () => {
    setImagePopup(false);
    setSelectedRow(null);
  };

  // refs for scrolling inside the dialog
  const imagesSectionRef = React.useRef<HTMLDivElement | null>(null);
  const descriptionSectionRef = React.useRef<HTMLDivElement | null>(null);
  // ref for the table container so we can use its scroll instead of the window
  const tableContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [tableExpanded, setTableExpanded] = React.useState<boolean>(false);

  // When a user clicks the Images/Description tab we simply scroll to that section
  // instead of swapping tab content. This keeps the dialog content in a single flow.
  const handleTabChangef = (_: React.SyntheticEvent, newValue: number) => {
    if (newValue === 0) {
      imagesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (newValue === 1) {
      descriptionSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // do not change tabValuef so the tab does not 'open' a new view
  };



  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSubTab(0);
  };
   const handleSubTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSubTab(newValue);
  };

  // Only show "Draft" sub tab for Single Uploads (tabValue === 1)
  // Use the state values we compute below so the tab labels show live counts
  const subTabs = tabValue === 0
    ? [
        'All',
        `Action Required (${bulkactionRequired})`,
        `QC in Progress (${bulkqcProgress})`,
        `QC Error (${bulkqcError})`,
        `QC Pass (${bulkqcPass})`,
      ]
    : [
        'All',
        `Action Required (${singleactionRequired})`,
        `QC in Progress (${singleqcProgress})`,
        `QC Error (${singleqcError})`,
        `QC Pass (${singleqcPass})`,
        `Draft (${singledrafts})`,
      ];

 const rows = catalog as RowData[]; 
// compute unique categories from catalog items using category_path[3]
const categories = React.useMemo(() => {
  if (!Array.isArray(catalog)) return [] as string[];
  const set = new Set<string>();
  (catalog as RowData[]).forEach(item => {
    if (Array.isArray(item.category_path) && item.category_path[3]) {
      set.add(String(item.category_path[3]));
    }
  });
  return Array.from(set).sort();
}, [catalog]);
  // derive the rows to display according to selected main tab (bulk/single) and sub-tab filter
  const displayedRows = React.useMemo(() => { 
    if (!Array.isArray(catalog)) return [];
    // start from catalog
    let list = [...(catalog as RowData[])];

    // filter by trough according to main tab
    if (tabValue === 0) {
      list = list.filter(item => item.trough === 'bulk');
    } else {
      list = list.filter(item => item.trough === 'single');
    }

    // map subTab index to status filter
    // 0: All
    // 1: Action Required -> 'action'
    // 2: QC in Progress -> 'pending' or 'inprogress'
    // 3: QC Error -> 'error'
    // 4: QC Pass -> 'pass'
    // 5: Draft (only for single) -> 'notyet'
    const statusMap: Record<number, string | string[] | null> = {
      0: null,
      1: 'action',
      2: ['pending', 'inprogress'],
      3: 'error',
      4: 'pass',
      5: 'notyet',
    };

    const filterStatus = statusMap[subTab] ?? null;
    if (filterStatus) {
      if (Array.isArray(filterStatus)) {
        list = list.filter(item => filterStatus.includes(item.QC_status));
      } else {
        list = list.filter(item => item.QC_status === filterStatus);
      }
    }

    // sort by created_at descending (newest first). Guard against missing dates.
    list.sort((a, b) => {
      const ta = a.created_at ? new Date(a.created_at).getTime() : 0;
      const tb = b.created_at ? new Date(b.created_at).getTime() : 0;
      return tb - ta;
    });

    // apply search by catalog_id (case-insensitive substring)
    if (searchQuery && typeof searchQuery === 'string' && searchQuery.trim() !== '') {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(item => (item.catalog_id || '').toLowerCase().includes(q));
    }

    // apply category filter based on category_path[3]
    if (categoryFilter && typeof categoryFilter === 'string' && categoryFilter.trim() !== '') {
      const cf = categoryFilter.trim().toLowerCase();
      list = list.filter(item => {
        const cp = Array.isArray(item.category_path) ? (item.category_path[3] || '') : '';
        return (cp || '').toLowerCase() === cf;
      });
    }

    return list;
  }, [catalog, tabValue, subTab, searchQuery, categoryFilter]);
React.useEffect(() => {
    // Only fetch when a user is available to avoid sending requests with an undefined userId
    if (!user || !user.id) return;

    const fetchCatalog = async () => {
      setLoading(true);
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
        setCatalog(data);
        setTotaluploads(data.length);
  setBulkuploads(data.filter((item: { trough: string }) => item.trough === 'bulk').length);
  setSingleuploads(data.filter((item: { trough: string }) => item.trough === 'single').length);
  // Use `data` (just fetched) rather than `rows` to avoid stale reads
  setBulkData(data.filter((item: { trough: string }) => item.trough === 'bulk'));
  setSingleData(data.filter((item: { trough: string }) => item.trough === 'single'));

        // console.log('Fetched catalog data:', data); // Debug log
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

React.useEffect(() => {
        setBulkQCprogress(bulkData.filter((item: { QC_status: string }) => item.QC_status === 'pending').length);
        setBulkQCerror(bulkData.filter((item: { QC_status: string }) => item.QC_status === 'error').length);
        setBulkQCpass(bulkData.filter((item: { QC_status: string }) => item.QC_status === 'pass').length);
        setBulkActionrequired(bulkData.filter((item: { QC_status: string }) => item.QC_status === 'action').length);
        setSingleDrafts(singleData.filter((item: { QC_status: string }) => item.QC_status === 'notyet').length);
        setSingleQCprogress(singleData.filter((item: { QC_status: string }) => item.QC_status === 'pending').length);
        setSingleQCerror(singleData.filter((item: { QC_status: string }) => item.QC_status === 'error').length);
        setSingleQCpass(singleData.filter((item: { QC_status: string }) => item.QC_status === 'pass').length);
        setSingleActionrequired(singleData.filter((item: { QC_status: string }) => item.QC_status === 'action').length);
      


      }, [bulkData, singleData]);


console.log('rows', singleData);
console.log('bulkData', bulkData);

// table container scroll infinite loader: load 10 more when near container bottom
React.useEffect(() => {
  const el = tableContainerRef.current;
  if (!el) return;
  const onScroll = () => {
    const threshold = 150; // px from bottom inside container
    const scrollTop = el.scrollTop;
    const viewportHeight = el.clientHeight;
    const fullHeight = el.scrollHeight;
    if (fullHeight - (scrollTop + viewportHeight) <= threshold) {
      if (visibleCount >= displayedRows.length || loadingMore) return;
      setLoadingMore(true);
      setTimeout(() => {
        setVisibleCount(prev => Math.min(prev + 10, displayedRows.length));
        setLoadingMore(false);
      }, 600);
    }
  };
  el.addEventListener('scroll', onScroll, { passive: true });
  return () => el.removeEventListener('scroll', onScroll);
}, [displayedRows, visibleCount, loadingMore]);

// Expand table container to fill remaining viewport when user starts scrolling it
React.useEffect(() => {
  const el = tableContainerRef.current;
  if (!el) return;
  let expanded = false;
  const expandToViewport = () => {
    const rect = el.getBoundingClientRect();
    const padding = 16; // leave a little gap below
    const avail = Math.max(window.innerHeight - rect.top - padding, 200);
    el.style.maxHeight = `${avail}px`;
    setTableExpanded(true);
    expanded = true;
  };

  const onFirstScroll = () => {
    if (!expanded) expandToViewport();
  };

  el.addEventListener('scroll', onFirstScroll, { passive: true });

  const onResize = () => {
    if (expanded) {
      const rect = el.getBoundingClientRect();
      const padding = 16;
      const avail = Math.max(window.innerHeight - rect.top - padding, 200);
      el.style.maxHeight = `${avail}px`;
    }
  };

  window.addEventListener('resize', onResize);

  return () => {
    el.removeEventListener('scroll', onFirstScroll);
    window.removeEventListener('resize', onResize);
  };
}, []);

React.useEffect(() => {
  // Reset visibleCount when user applies search/category/tab filters
  setVisibleCount(10);
}, [searchQuery, categoryFilter, tabValue, subTab]);



//console.log('rows', rows);

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

  // Render a styled status chip matching the designs (Draft purple, QC Error red, QC Pass green)
  const renderStatusChip = (row: RowData) => {
    const status = row.QC_status;
    // common chip base sx
    const baseSx = {
      borderRadius: '16px',
      px: 1.2,
      py: 0.25,
      fontWeight: 700,
      height: 28,
      fontSize: '0.8rem',
    } as any;

    if (status === 'notyet') {
      const color = '#5b3cc4';
      return (
        <Chip
          label="Draft"
          size="small"
          icon={<DescriptionIcon sx={{ color }} />}
          sx={{ ...baseSx, backgroundColor: '#f3e8ff', color }}
        />
      );
    }

    if (status === 'error') {
      const color = '#f44336';
      return (
        <Chip
          label="QC Error"
          size="small"
          icon={<WarningAmberIcon sx={{ color, fontSize: 16 }} />}
          sx={{ ...baseSx, backgroundColor: '#fff1f0', color }}
        />
      );
    }

    if (status === 'pass') {
      const color = '#168b43';
      return (
        <Chip
          label="QC Pass"
          size="small"
          icon={<CheckCircleIcon sx={{ color, fontSize: 16 }} />}
          sx={{ ...baseSx, backgroundColor: '#ecfdf1', color }}
        />
      );
    }

    if (status === 'pending' || status === 'inprogress') {
      const color = '#0f62fe';
      return (
        <Chip
          label="QC in Progress"
          size="small"
          sx={{ ...baseSx, backgroundColor: '#e8f0ff', color }}
        />
      );
    }

    if (status === 'action') {
      const color = '#d32f2f';
      return (
        <Chip
          label="Action Required"
          size="small"
          sx={{ ...baseSx, backgroundColor: '#fff4f4', color }}
        />
      );
    }

    // fallback
    return (
      <Chip
        label={status || 'Unknown'}
        size="small"
        sx={{ ...baseSx }}
      />
    );
  };
//console.log('displayedRows', displayedRows);
console.log('selectedRow', selectedRow);
  return (<>
    <Box sx={{ p: 3, backgroundColor: '#ffff', mr: -3, ml: -3 , mt: 1}}>
      {/* Tabs */}
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label={`Bulk Uploads (${bulkuploads})`} />
        <Tab label={`Single Uploads (${singleuploads})`} />
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
          <Select
            label="Select Category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(String(e.target.value))}
          >
            <MenuItem value="">All</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Search By File Id"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Stack>

     
    </Box>
 {/* Bottom Info */}
      <Alert severity="info" sx={{  mr: -3, ml: -3, backgroundColor: '#fffbe6', border: '1px solid #ffe58f', color: '#664d03', mt:0.5 }}>
        💡 QC (Quality-Check) error products can now be fixed as they appear. Try to fix QC errors faster to speed up your catalog creation process.
      </Alert>
      {displayedRows.length <= 0 && (
    <Box sx={{ p: 15, backgroundColor: '#fff', mr: -3, ml: -3 , mt: 0.5, textAlign: 'center',display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
       <NoCatalogSVG />
  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
    
    No Results

  </Typography>
        
      <Typography variant="body2" sx={{ mb: 2 }}>
        No catalogs exist. Upload a new catalog using No catalogs found. Please upload button on the top</Typography>
  </Box>)}
{displayedRows.length > 0 && (
  <TableContainer
    component={Paper}
    elevation={1}
    ref={tableContainerRef}
    sx={{ mr: -3, ml: -3, mt: 0.5, width: '1150px', borderRadius: 0, maxHeight: '90vh', overflowY: 'auto' }}
  >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 3 }}><strong>S.no</strong></TableCell>
            <TableCell sx={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 3 }}><strong>Catalog Image</strong></TableCell>
            <TableCell sx={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 3 }}><strong>Category</strong></TableCell>
            <TableCell sx={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 3 }}><strong>File Id</strong></TableCell>
            <TableCell sx={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 3 }}><strong>Created Date</strong></TableCell>
            <TableCell sx={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 3 }}><strong>Products</strong></TableCell>
            <TableCell sx={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 3 }}><strong>QC Status</strong></TableCell>
            <TableCell sx={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 3 }}><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayedRows.slice(0, visibleCount).map((row, index) => (
            
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
                {renderStatusChip(row)}
              </TableCell>
              

              {/* Actions */}
              <TableCell>
                {row.QC_status === 'notyet' ? (
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                    onClick={() => {
                      setSelectedRow(row);
                      setImagePopup(true);
                    }}
                  >
                    Edit
                  </Button>
                ) : row.QC_status === 'pending' ? (
                  // intentionally render nothing for pending
                  null
                ) : row.QC_status === 'pass' ? (
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: '#4d0aff',
                      color: '#4d0aff',
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                    onClick={() => {
                      setSelectedRow(row);
                      setImagePopup(true);
                    }}
                  >
                    View
                  </Button>
                ) : row.QC_status === 'error' ? (
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    sx={{ textTransform: 'none', fontWeight: 600, borderColor: '#f44336', color: '#f44336' }}
                    onClick={() => {
                      // open dialog and allow user to inspect error row or navigate to inventory
                      setSelectedRow(row);
                      setImagePopup(true);
                    }}
                  >
                    View Inventory
                  </Button>
                ) : (
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
                )}
              </TableCell>
            </TableRow>
          ))}
          {loadingMore && (
            // show 3 skeleton rows while loading more
            Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={`skeleton-${i}`}>
                <TableCell><Skeleton variant="rectangular" width={24} height={16} /></TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Skeleton variant="circular" width={56} height={56} />
                    <Skeleton variant="rectangular" width={80} height={20} />
                  </Box>
                </TableCell>
                <TableCell><Skeleton variant="rectangular" width={120} height={20} /></TableCell>
                <TableCell><Skeleton variant="rectangular" width={180} height={20} /></TableCell>
                <TableCell><Skeleton variant="rectangular" width={160} height={20} /></TableCell>
                <TableCell><Skeleton variant="rectangular" width={40} height={20} /></TableCell>
                <TableCell><Skeleton variant="rectangular" width={96} height={28} /></TableCell>
                <TableCell><Skeleton variant="rectangular" width={120} height={36} /></TableCell>
              </TableRow>
            ))
          )}
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

        <div ref={imagesSectionRef}>
        {selectedRow && (

          <Box mt={2}>
            {/* If there are multiple product_forms, show each product form's primary image as a horizontally scrollable thumbnail row */}
            {Array.isArray(selectedRow.product_forms) && selectedRow.product_forms.length > 1 ? (
              <Box sx={{ display: 'flex', flexDirection: 'row'  }}>
                <Box sx={{ display: 'flex', gap: 0.5, flexDirection: 'column', pb: 0.5 }}>
                  {selectedRow.product_forms.map((pf, idx) => {
                    const img = pf?.OtherAttributes?.image_urls?.[0] as string | undefined;
                    return (
                      <Box key={idx} sx={{ display: 'inline-flex', p: 0.5 }}>
                        <Avatar
                          variant="rounded"
                          src={img}
                          alt={`product-${idx}`}
                          sx={{ width: 56, height: 56, border: popupMainImage === img ? '3px solid #5b3cc4' : '2px solid #ddd', cursor: img ? 'pointer' : 'default' }}
                          onClick={() => { if (img) setPopupMainImage(img); }}
                        />
                      </Box>
                    );
                  })}
                </Box>
                {/* Main image area; default to first product form's primary image or popupMainImage if set */}
                <Box sx={{ flexGrow: 1, ml: 2 }}>
                  <Box component="img"
                    id="catalog-popup-main-image"
                    src={popupMainImage ?? selectedRow.product_forms?.[0]?.OtherAttributes?.image_urls?.[0]}
                    alt="Product"
                    sx={{ width: "100%", maxHeight: 300, objectFit: "contain" }}
                  />
                </Box>
              </Box>
            ) : (
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
            )}

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

        </div>
        <div ref={descriptionSectionRef}>
        {selectedRow && (
          <Box mt={2}>
            
          </Box>
        )}
        </div>
      </DialogContent>
      <DialogActions>
          <Button onClick={onClose} variant="contained" color="primary">
            OK
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              // Insert a placeholder product into selectedRow and update local catalog state
              if (!selectedRow) return;
              const newProduct = {
                OtherAttributes: { image_urls: ['https://via.placeholder.com/300'], title: 'New Product' }
              };
              // update selectedRow in-place
              const updatedRow = { ...selectedRow } as any;
              updatedRow.product_forms = Array.isArray(updatedRow.product_forms) ? [...updatedRow.product_forms, newProduct] : [newProduct];
              setSelectedRow(updatedRow);
              // reflect change back into catalog state
              setCatalog(prev => {
                return Array.isArray(prev) ? prev.map((r: any) => (r.catalog_id === updatedRow.catalog_id ? updatedRow : r)) : prev;
              });
            }}
          >
            Add Product
          </Button>
      </DialogActions>
    </Dialog>


    </>
  );
}
