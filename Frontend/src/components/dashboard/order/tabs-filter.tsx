"use client";
import React from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Grid from '@mui/material/Grid';
import { Order, order } from '@/components/dashboard/order/order';
import Typography from '@mui/material/Typography';
import { UserContext } from '@/contexts/user-context';
import { toast, ToastContainer } from 'react-toastify';
import { useSearchParams, useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isBetween from 'dayjs/plugin/isBetween';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Popover from '@mui/material/Popover';
import Noorder from '@/components/dashboard/order/noorder';
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);




function TabsFilter() : React.JSX.Element {
  const [search, setSearch] = React.useState('');
  const [orders, setOrder] = React.useState<order[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [tab, setTab] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  
  const [startDate, setStartDate] = React.useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = React.useState<dayjs.Dayjs | null>(null);

  // SLA Status filter state
  const [slaStatus, setSlaStatus] = React.useState<string[]>([]);
  const [dispatchStartDate, setDispatchStartDate] = React.useState<dayjs.Dayjs | null>(null);
  const [dispatchEndDate, setDispatchEndDate] = React.useState<dayjs.Dayjs | null>(null);
  const [orderStartDate, setOrderStartDate] = React.useState<dayjs.Dayjs | null>(null);
  const [orderEndDate, setOrderEndDate] = React.useState<dayjs.Dayjs | null>(null);

  // Popover state for Dispatch Date and Order Date dropdowns
  const [dispatchAnchorEl, setDispatchAnchorEl] = React.useState<null | HTMLElement>(null);
  const [orderAnchorEl, setOrderAnchorEl] = React.useState<null | HTMLElement>(null);
 

  // Ready to Ship tab filter states
  const [rtsSlaStatus, setRtsSlaStatus] = React.useState<string[]>([]);
  const [rtsSlaStatusAnchorEl, setRtsSlaStatusAnchorEl] = React.useState<null | HTMLElement>(null);
  const [labelDownloaded, setLabelDownloaded] = React.useState<string>('');
  const [labelDownloadedAnchorEl, setLabelDownloadedAnchorEl] = React.useState<null | HTMLElement>(null);
  const [allFiltersTab, setAllFiltersTab] = React.useState(0); // 0: Dispatch Date, 1: Order Date
  
  const [dispatchRadio, setDispatchRadio] = React.useState<string>('');
  const [dispatchCustomStart, setDispatchCustomStart] = React.useState<dayjs.Dayjs | null>(null);
  const [dispatchCustomEnd, setDispatchCustomEnd] = React.useState<dayjs.Dayjs | null>(null);

  const [orderRadio, setOrderRadio] = React.useState<string>('');
  const [orderCustomStart, setOrderCustomStart] = React.useState<dayjs.Dayjs | null>(null);
  const [orderCustomEnd, setOrderCustomEnd] = React.useState<dayjs.Dayjs | null>(null);

  // Removed unused: orderAllStart, setOrderAllStart, orderAllEnd, setOrderAllEnd, pendingDispatchRadio, setPendingDispatchRadio, pendingDispatchCustomStart, setPendingDispatchCustomStart, pendingDispatchCustomEnd, setPendingDispatchCustomEnd, pendingOrderAllStart, setPendingOrderAllStart, pendingOrderAllEnd, setPendingOrderAllEnd
  // SLA Status anchor for Pending tab
  const [slaStatusAnchorEl, setSlaStatusAnchorEl] = React.useState<null | HTMLElement>(null);

  // Learn how to process orders dialog state
  
  const userContext = React.useContext(UserContext);
  const user = userContext?.user;
  const searchParams = useSearchParams();
  const router = useRouter();




  React.useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL + '/orderfetch';
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
        setOrder(data);
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
    fetchOrders();
  }, [user]);

  React.useEffect(() => {
    if (searchParams.get('added')) {
      toast.success('order added successfully!');
      // Remove the param so it doesn't show again on refresh
  const params = new URLSearchParams([...searchParams.entries()]);
      params.delete('added');
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, router, user]);

  // Delete handler
  //const handleDelete = async (orders_id: string) => {
  //if (!globalThis.confirm('Are you sure you want to delete this order?')) return;
  //  try {
  //    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL + 'order/' + orders_id;
  //    const res = await fetch(apiUrl, { method: 'DELETE' });
  //    if (!res.ok) throw new Error('Failed to delete order');
  //    setOrder((prev) => prev.filter((order) => order.orders_id !== orders_id));
  //  } catch (error_: unknown) {
  //    if (error_ instanceof Error) {
  //      alert(error_.message || 'Error deleting order');
  //    } else {
  //      alert('Error deleting order');
  //    }
  //  }
  //};
  const handleAccept = async (orders_id: string) => {
  if (!globalThis.confirm('Are you sure you want to delete this order?')) return;
    try {
      const data = { sta: 'Ready To Ship' }; // Update status to 'Ready To Ship'
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL + '/order/' + orders_id;
      const res = await fetch(apiUrl, { method: 'POST' , 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(data) });
      console.log('data', data);
      if (!res.ok) throw new Error('Failed to delete order');
      setOrder((prev) => prev.filter((order) => order.orders_id !== orders_id));
      
    } catch (error_: unknown) {
      if (error_ instanceof Error) {
        alert(error_.message || 'Error deleting order');
      } else {
        alert('Error deleting order');
      }
    }
  };
  const handleCancel = async (orders_id: string) => {
  if (!globalThis.confirm('Are you sure you want to delete this order?')) return;
    try {
      const data = { sta: 'on hold' }; // Update status to 'Cancelled'
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL + '/order/' + orders_id;
      const res = await fetch(apiUrl, { method: 'POST' , headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error('Failed to delete order');
      setOrder((prev) => prev.filter((order) => order.orders_id !== orders_id));
    } catch (error_: unknown) {
      if (error_ instanceof Error) {
        alert(error_.message || 'Error deleting order');
      } else {
        alert('Error deleting order');
      }
    }
  };


  // Filter categories based on start and end date
  const filteredOrders = React.useMemo(() => {
    let result = orders;
    if (startDate) {
      result = result.filter((order) => dayjs(order.orderDate).isSameOrAfter(startDate, 'day'));
    }
    if (endDate) {
      result = result.filter((order) => dayjs(order.orderDate).isSameOrBefore(endDate, 'day'));
    }
    return result;
  }, [orders, startDate, endDate]);

  // Map tab index to order status
  // Removed unused: tabStatusMap

  // Filter orders by selected tab status and extra filters for Pending
  const tabFilteredOrders = React.useMemo(() => {
    let result = filteredOrders;
    switch (tab) {
      case 0: {
        result = result.filter(order => order.sta === 'On Hold');
        break;
      }
      case 1: {
        result = result.filter(order => order.sta === 'pending');
        // SLA Status filter
        if (slaStatus.length > 0) {
          result = result.filter(order => slaStatus.includes(order.slaStatus));
        }
        // Dispatch Date filter
        if (dispatchStartDate) {
          result = result.filter(order => dayjs(order.dispatchDate).isSameOrAfter(dispatchStartDate, 'day'));
        }
        if (dispatchEndDate) {
          result = result.filter(order => dayjs(order.dispatchDate).isSameOrBefore(dispatchEndDate, 'day'));
        }
        // Order Date filter
        if (orderStartDate) {
          result = result.filter(order => dayjs(order.orderDate).isSameOrAfter(orderStartDate, 'day'));
        }
        if (orderEndDate) {
          result = result.filter(order => dayjs(order.orderDate).isSameOrBefore(orderEndDate, 'day'));
        }
        break;
      }
      case 2: {
        result = result.filter(order => order.sta === 'Ready To Ship');
        // SLA Status filter
        if (rtsSlaStatus.length > 0) {
          result = result.filter(order => rtsSlaStatus.includes(order.slaStatus));
          
        }
        // Label Downloaded filter
        if (labelDownloaded) {
          result = result.filter(order => order.labelDownloaded === (labelDownloaded === 'Yes'));
        }
        // Dispatch Date filter
        switch (dispatchRadio) {
          case 'Today': {
            result = result.filter(order => dayjs(order.dispatchDate).isSame(dayjs(), 'day'));
            break;
          }
          case 'Tomorrow': {
            result = result.filter(order => dayjs(order.dispatchDate).isSame(dayjs().add(1, 'day'), 'day'));
            break;
          }
          case 'Next 3 Days': {
            result = result.filter(order => dayjs(order.dispatchDate).isBetween(dayjs(), dayjs().add(3, 'day'), 'day', '[]'));
            break;
          }
          case 'Custom': {
            if (dispatchCustomStart && dispatchCustomEnd) {
              result = result.filter(order => dayjs(order.dispatchDate).isBetween(dispatchCustomStart, dispatchCustomEnd, 'day', '[]'));
            }
            break;
          }
        }
        // Order Date filter from All Filters tab (radio logic)
        switch (orderRadio) {
          case 'Today': {
            result = result.filter(order => dayjs(order.orderDate).isSame(dayjs(), 'day'));
            break;
          }
          case 'Yesterday': {
            result = result.filter(order => dayjs(order.orderDate).isSame(dayjs().subtract(1, 'day'), 'day'));
            break;
          }
          case 'Last 3 days': {
            result = result.filter(order => dayjs(order.orderDate).isBetween(dayjs(), dayjs().subtract(3, 'day'), 'day', '[]'));
            break;
          }
          case 'Custom': {
            if (orderCustomStart && orderCustomEnd) {
              result = result.filter(order => dayjs(order.orderDate).isBetween(orderCustomStart, orderCustomEnd, 'day', '[]'));
            }
            break;
          }
        }
        break;
      }
      case 3: {
        result = result.filter(order => order.sta === 'Shipped');
        break;
      }
      case 4: {
        result = result.filter(order => order.sta === 'Cancelled');
        break;
      }
      default: {
        break;
      }
    }
    return result;
  }, [filteredOrders, tab, slaStatus, dispatchStartDate, dispatchEndDate, orderStartDate, orderEndDate, rtsSlaStatus, labelDownloaded, dispatchRadio, dispatchCustomStart, dispatchCustomEnd, orderCustomEnd, orderCustomStart, orderRadio]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
 
  const handleFilterClose = () => {
    setAnchorEl(null);
  };
 
  const open = Boolean(anchorEl);
  

  // Debug: Log available statuses in orders
  React.useEffect(() => {
    if (orders && orders.length > 0) {
      console.log('First order object:', orders[0]);
  const statuses = [...new Set(orders.map(o => o.sta))];
      console.log('Available order statuses:', statuses);
    }
  }, [orders]);

  // All Filters Dropdown UI for Ready to Ship
  const [allFiltersOpen, setAllFiltersOpen] = React.useState(false);
  const [allFiltersAnchorEl, setAllFiltersAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleAllFiltersClick = (event: React.MouseEvent<HTMLElement>) => {
    setAllFiltersOpen(true);
    setAllFiltersAnchorEl(event.currentTarget);
  };
  const handleAllFiltersClose = () => {
    setAllFiltersOpen(false);
    setAllFiltersAnchorEl(null);
    setDispatchRadio('');
    setDispatchCustomStart(null);
    setDispatchCustomEnd(null);
    setOrderRadio('');
    setOrderCustomStart(null);
    setOrderCustomEnd(null);
  };

  // Download popover state and handler


  return (
    <>
      {/* Top bar with filter, search, and add button */}
      <Box sx={{  mt: 1  }}>
        <Tabs sx={{ mr:-3, ml:-3, backgroundColor: '#ffffff', padding: '0px'  }}
          value={tab}
          onChange={handleTabChange}
          aria-label="Order Tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab sx={{ml:3 , mr:3}} label="On Hold" />
          <Tab label="Pending" />
          <Tab label="Ready to Ship" />
          <Tab label="Shipped" />
          <Tab label="Cancelled" />
        </Tabs>
      </Box>
      {(tab === 0 || tab === 1 || tab === 2) && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 0,
            mt: 0.3,
            gap: 2,
            flexWrap: 'wrap',
            mr:-3, ml:-3, backgroundColor: '#ffffff', padding: '16px'  
          }}
        >
          {/* Show Order Date filter for all tabs except Pending and Ready to Ship */}
          {tab === 0 && (
            <>
              <Typography variant="subtitle1" sx={{ fontWeight:400 }}>
                Filter By:</Typography>
              <Button onClick={handleFilterClick} size="small" variant="outlined" sx={{ minWidth: 110 }}>
                Order Date
              </Button>
              <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleFilterClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
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
                      variant="outlined"
                      size="small"
                      onClick={() => { setStartDate(null); setEndDate(null); handleFilterClose(); }}
                    >
                      Reset
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleFilterClose}
                    >
                      Apply
                    </Button>
                  </Box>
                </Box>
              </Popover>
            </>
          )}
          {/* Extra filters for Pending tab */}
          {tab === 1 && (
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
          )}
{/* Extra filters for Ready to Ship tab */}
          {tab === 2 && (
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight:400 }}>
                Filter By:</Typography>
              {/* SLA Status Button + Popover with checkboxes */}
              <Button
                variant="outlined"
                size="small"
                sx={{ minWidth: 120 }}
                onClick={e => setRtsSlaStatusAnchorEl(e.currentTarget)}
              >
                SLA Status
              </Button>
              <Popover
                open={Boolean(rtsSlaStatusAnchorEl)}
                anchorEl={rtsSlaStatusAnchorEl}
                onClose={() => setRtsSlaStatusAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                PaperProps={{ sx: { minWidth: 220, p: 2 } }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <input
                      type="checkbox"
                      checked={rtsSlaStatus.includes('Breached')}
                      onChange={() => setRtsSlaStatus(rtsSlaStatus.includes('Breached') ? rtsSlaStatus.filter(s => s !== 'Breached') : [...rtsSlaStatus, 'Breached'])}
                    />
                    Breached
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <input
                      type="checkbox"
                      checked={rtsSlaStatus.includes('Breaching Soon')}
                      onChange={() => setRtsSlaStatus(rtsSlaStatus.includes('Breaching Soon') ? rtsSlaStatus.filter(s => s !== 'Breaching Soon') : [...rtsSlaStatus, 'Breaching Soon'])}
                    />
                    Breaching Soon
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <input
                      type="checkbox"
                      checked={rtsSlaStatus.includes('Others')}
                      onChange={() => setRtsSlaStatus(rtsSlaStatus.includes('Others') ? rtsSlaStatus.filter(s => s !== 'Others') : [...rtsSlaStatus, 'Others'])}
                    />
                    Others
                  </label>
                  <Button size="small" onClick={() => setRtsSlaStatus([])}>Clear</Button>
                </Box>
              </Popover>
              {/* Label Downloaded Button + Popover with radio buttons */}
              <Button
                variant="outlined"
                size="small"
                sx={{ minWidth: 120 }}
                onClick={e => setLabelDownloadedAnchorEl(e.currentTarget)}
              >
                Label Downloaded
              </Button>
              <Popover
                open={Boolean(labelDownloadedAnchorEl)}
                anchorEl={labelDownloadedAnchorEl}
                onClose={() => setLabelDownloadedAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                PaperProps={{ sx: { minWidth: 180, p: 2 } }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <input
                      type="radio"
                      checked={labelDownloaded === 'Yes'}
                      onChange={() => setLabelDownloaded('Yes')}
                      name="labelDownloaded"
                    />
                    Yes
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <input
                      type="radio"
                      checked={labelDownloaded === 'No'}
                      onChange={() => setLabelDownloaded('No')}
                      name="labelDownloaded"
                    />
                    No
                  </label>
                  <Button size="small" onClick={() => setLabelDownloaded('')}>Clear</Button>
                </Box>
              </Popover>
              {/* All Filters Button and Popover for Ready to Ship */}
              <Button
                variant="outlined"
                size="small"
                sx={{ minWidth: 120 }}
                onClick={handleAllFiltersClick}
              >
                All Filters
              </Button>
              <Popover
                open={allFiltersOpen}
                anchorEl={allFiltersAnchorEl}
                onClose={handleAllFiltersClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                PaperProps={{ sx: { minWidth: 340, p: 2 } }}
              >
                <Box sx={{ display: 'flex', minWidth: 320 }}>
                  {/* Side Tabs */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', borderRight: 1, borderColor: 'divider', pr: 2 }}>
                    <Button size="small" variant={allFiltersTab === 0 ? 'contained' : 'text'} onClick={() => setAllFiltersTab(0)} sx={{ mb: 1 }}>Dispatch Date</Button>
                    <Button size="small" variant={allFiltersTab === 1 ? 'contained' : 'text'} onClick={() => setAllFiltersTab(1)}>Order Date</Button>
                  </Box>
                  {/* Tab Content */}
                  <Box sx={{ flex: 1, pl: 2 }}>
                    {allFiltersTab === 0 ? (
                      <>
                        {/* Dispatch Date Radio Group */}
                        <Box>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <input
                              type="radio"
                              checked={dispatchRadio === 'Today'}
                              onChange={() => setDispatchRadio('Today')}
                              name="dispatchRadio"
                            />
                            Today
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <input
                              type="radio"
                              checked={dispatchRadio === 'Tomorrow'}
                              onChange={() => setDispatchRadio('Tomorrow')}
                              name="dispatchRadio"
                            />
                            Tomorrow
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <input
                              type="radio"
                              checked={dispatchRadio === 'Next 3 Days'}
                              onChange={() => setDispatchRadio('Next 3 Days')}
                              name="dispatchRadio"
                            />
                            Next 3 Days
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <input
                              type="radio"
                              checked={dispatchRadio === 'Custom'}
                              onChange={() => setDispatchRadio('Custom')}
                              name="dispatchRadio"
                            />
                            Custom date range
                          </label>
                        </Box>
                        {dispatchRadio === 'Custom' && (
                          <Box sx={{ mt: 1 }}>
                            <TextField
                              type="date"
                              size="small"
                              label="Start Date"
                              InputLabelProps={{ shrink: true }}
                              value={dispatchCustomStart ? dispatchCustomStart.format('YYYY-MM-DD') : ''}
                              onChange={e => setDispatchCustomStart(e.target.value ? dayjs(e.target.value) : null)}
                            />
                            <TextField
                              type="date"
                              size="small"
                              label="End Date"
                              InputLabelProps={{ shrink: true }}
                              value={dispatchCustomEnd ? dispatchCustomEnd.format('YYYY-MM-DD') : ''}
                              onChange={e => setDispatchCustomEnd(e.target.value ? dayjs(e.target.value) : null)}
                            />
                          </Box>
                        )}
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              setDispatchRadio('');
                              setDispatchCustomStart(null);
                              setDispatchCustomEnd(null);
                            }}
                          >
                            Clear
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={handleAllFiltersClose}
                            disabled={dispatchRadio === 'Custom' && (!dispatchCustomStart || !dispatchCustomEnd)}
                          >
                            Apply
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Box>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <input
                              type="radio"
                              checked={orderRadio === 'Today'}
                              onChange={() => setOrderRadio('Today')}
                              name="orderRadio"
                            />
                            Today
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <input
                              type="radio"
                              checked={orderRadio === 'Yesterday'}
                              onChange={() => setOrderRadio('Yesterday')}
                              name="orderRadio"
                            />
                            Yesterday
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <input
                              type="radio"
                              checked={orderRadio === 'Last 3 Days'}
                              onChange={() => setOrderRadio('Last 3 Days')}
                              name="orderRadio"
                            />
                            Last 3 Days
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <input
                              type="radio"
                              checked={orderRadio === 'Custom'}
                              onChange={() => setOrderRadio('Custom')}
                              name="orderRadio"
                            />
                            Custom date range
                          </label>
                        </Box>
                        {orderRadio === 'Custom' && (
                          <Box sx={{ mt: 1 }}>
                            <TextField
                              type="date"
                              size="small"
                              label="Start Date"
                              InputLabelProps={{ shrink: true }}
                              value={orderCustomStart ? orderCustomStart.format('YYYY-MM-DD') : ''}
                              onChange={e => setOrderCustomStart(e.target.value ? dayjs(e.target.value) : null)}
                            />
                            <TextField
                              type="date"
                              size="small"
                              label="End Date"
                              InputLabelProps={{ shrink: true }}
                              value={orderCustomEnd ? orderCustomEnd.format('YYYY-MM-DD') : ''}
                              onChange={e => setOrderCustomEnd(e.target.value ? dayjs(e.target.value) : null)}
                            />
                          </Box>
                        )}
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              setOrderRadio('');
                              setOrderCustomStart(null);
                              setOrderCustomEnd(null);
                            }}
                          >
                            Clear
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={handleAllFiltersClose}
                            disabled={orderRadio === 'Custom' && (!orderCustomStart || !orderCustomEnd)}
                          >
                            Apply
                          </Button>
                        </Box>
                      </>
                    )}
                  </Box>
                </Box>
              </Popover>
            </Box>
          )}
          {/* SKU Search field right aligned */}
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
      )}
      {loading && <Typography>Loading Orders...</Typography>}
      {error && (
        <Box>
          {error === 'No Order Found' && (
            <Box sx={{    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    mt: 20,}}>
           <Box sx={{ mr: 2 }}>
                     <Noorder />
      </Box>

      {/* Texts */}
      <Box>
        <Typography variant="h6" fontWeight="bold" display="inline">
          No orders yet
        </Typography>
        </Box><Box>
        <Typography variant="body2" display="inline" ml={1}>
          But keep checking this section from time to time.
        </Typography>
      </Box>
          
            </Box>
          ) }  
          {error !== 'No Order Found' && (
            <Typography color="error" sx={{ textAlign: 'center', mt: 4 }}>
              {error}
            </Typography>
          )}
        </Box>

      )}
      {!loading && !error && (
        <>
          <Grid
            size={{
              lg: 12,
              md: 12,
              xs: 12,
            }}
          >
            {tabFilteredOrders.length > 0 ? (
              <Order
                order={tabFilteredOrders}
                onCancel={handleCancel}
                onAccept={handleAccept}
                sx={{ height: '100%', borderRadius: 0, mt: 0.3, mb: 2 , ml: -2, mr: -2, }}
              />
            ) : (
             <Box sx={{    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    mt: 20,}}>
           <Box sx={{ mr: 2 }}>
                     <Noorder />
      </Box>

      {/* Texts */}
      <Box>
        <Typography variant="h6" fontWeight="bold" display="inline">
          No orders yet
        </Typography>
        </Box><Box>
        <Typography variant="body2" display="inline" ml={1}>
          But keep checking this section from time to time.
        </Typography>
      </Box>
          
            </Box>
            )}
          </Grid>
        </>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default TabsFilter