"use client";
import React, { useState } from 'react';
import {
  Box, Typography, Tabs, Tab, Select, MenuItem,
  FormControl, InputLabel, Stack, Button, Divider, List, ListItem,
  ListItemButton, ListItemText, Paper,
} from '@mui/material';


 // Sample catalog data
const catalogData = [
  {
    id: 1,
    name: 'Useful Tissue Papers',
    category: 'Tissue Papers',
    styleId: 'SEMI EMBOSSING VERGING',
    sku: 'SEMI EMBOSSING VERGING',
    price: 238,
    variation: 'Free Size',
    remarks: 'Not restocked since 23 Nov, 2024',
    stock: 0,
  },
  {
    id: 2,
    name: 'Trendy Cooling Pad',
    category: 'Cooling Pads',
    stock: 12,
  },
  {
    id: 3,
    name: 'Trendy Kids Wooden Puzzle',
    category: 'Wooden Puzzle',
    stock: 5,
  },
];





export default function TabsInventory(): React.JSX.Element {
  const [mainTab, setMainTab] = useState(0);
  const [subTab, setSubTab] = useState(0);
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('Highest Estimated Orders');
   const [selectedCatalog, setSelectedCatalog] = useState(catalogData[0]);

  // Subtabs for Blocked tab
  const blockedSubTabs = [
    'All',
    'Duplicate',
    'Poor Quality',
    'Verification Failed',
    'Account Paused',
    'Others',
  ];


 
  return (
    <Box sx={{ p: 2, backgroundColor: '#fff', mr: -3, ml: -3 }}>
      {/* Top Tabs */}
      <Tabs value={mainTab} onChange={(e, val) => { setMainTab(val); setSubTab(0); }} sx={{ mb: 1 }}>
        <Tab label="Active (0)" />
        <Tab label="Activation Pending (0)" />
        <Tab label="Blocked (24)" />
        <Tab label="Paused (139)" />
      </Tabs>

      {/* Sub Tabs or Filter UI based on mainTab */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {mainTab === 0 && (
          // Active tab: show subtabs
          <Tabs
            value={subTab}
            onChange={(e, val) => setSubTab(val)}
            sx={{ mb: 2 }}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="All Stock (0)" />
            <Tab label="Out of Stock (0)" />
            <Tab label="Low Stock (0)" />
          </Tabs>
        )}
        {mainTab === 1 && (
          // Activation Pending tab: show filter by text and category dropdown
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography sx={{ fontWeight: 'bold' }}>Filter by:</Typography>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Select Category</InputLabel>
              <Select
                label="Select Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Fashion">Fashion</MenuItem>
                <MenuItem value="Home">Home</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}
        {mainTab === 2 && (
          // Blocked tab: show blocked subtabs
          <Tabs
            value={subTab}
            onChange={(e, val) => setSubTab(val)}
            sx={{ mb: 2 }}
            variant="scrollable"
            scrollButtons="auto"
          >
            {blockedSubTabs.map((label, _idx) => (
              <Tab key={label} label={label} />
            ))}
          </Tabs>
        )}
        {/* Bulk Stock Update button always visible */}
        <Button
          variant="text"
          sx={{ color: '#3f51b5', fontWeight: 'bold', textTransform: 'none' }}
        >
          📦 Bulk Stock Update
        </Button>
      </Box>

      {/* Filter and Sort section (only for Active and Activation Pending) */}
      {(mainTab === 0 ) && (
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          sx={{ mb: 2 }}
        >
          {/* Filter by Category (Active only) */}
          {mainTab === 0 && (
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Select Category</InputLabel>
              <Select
                label="Select Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Fashion">Fashion</MenuItem>
                <MenuItem value="Home">Home</MenuItem>
              </Select>
            </FormControl>
          )}

          {/* Sort catalogs by */}
          <Box display="flex" alignItems="center" flexWrap="wrap">
            <Typography sx={{ mr: 1 }}>Sort catalogs by:</Typography>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <Select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <MenuItem value="Highest Estimated Orders">Highest Estimated Orders</MenuItem>
                <MenuItem value="Lowest Estimated Orders">Lowest Estimated Orders</MenuItem>
                <MenuItem value="Recently Added">Recently Added</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Stack>
      )}

      <Divider sx={{ mb: 1 }} />
    {/* Layout: Left catalog list and right details */}
      <Stack direction="row" spacing={2}>
        {/* Left side: Catalog List */}
        <Box sx={{ width: '30%', maxHeight: 500, overflowY: 'auto', border: '1px solid #ddd', borderRadius: 1 }}>
          <List disablePadding>
            {catalogData.map((catalog) => (
              <ListItem key={catalog.id} disablePadding>
                <ListItemButton
                  selected={selectedCatalog?.id === catalog.id}
                  onClick={() => setSelectedCatalog(catalog)}
                >
                  <ListItemText
                    primary={catalog.name}
                    secondary={`Category: ${catalog.category}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Right side: Catalog Details */}
        <Box sx={{ flexGrow: 1 }}>
          {selectedCatalog ? (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {selectedCatalog.name}
              </Typography>
              <Typography><strong>Category:</strong> {selectedCatalog.category}</Typography>
              {selectedCatalog.styleId && (
                <Typography><strong>Style ID:</strong> {selectedCatalog.styleId}</Typography>
              )}
              {selectedCatalog.sku && (
                <Typography><strong>SKU:</strong> {selectedCatalog.sku}</Typography>
              )}
              {selectedCatalog.price && (
                <Typography><strong>Price:</strong> ₹{selectedCatalog.price}</Typography>
              )}
              {selectedCatalog.variation && (
                <Typography><strong>Variation:</strong> {selectedCatalog.variation}</Typography>
              )}
              {selectedCatalog.remarks && (
                <Typography><strong>Remarks:</strong> {selectedCatalog.remarks}</Typography>
              )}
              <Typography><strong>Current Stock:</strong> {selectedCatalog.stock}</Typography>
            </Paper>
          ) : (
            <Typography>Select a catalog to view details.</Typography>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
