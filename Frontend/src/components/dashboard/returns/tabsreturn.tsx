'use client';
import React from 'react'
import { Box, Tab, Tabs, Typography, Button, Divider  } from '@mui/material';
import Popover from '@mui/material/Popover';
import { CaretDownIcon } from '@phosphor-icons/react/dist/ssr/CaretDown';
import { TrendUpIcon } from '@phosphor-icons/react';
import ClamsSvg from './clamssvg';
import CourierPartnerTable from './courier-partner-table';

export default function TabsReturn(): React.JSX.Element {
  const sectionFilterOptions = [
    // 0: In transit
    [
      {
        group: 'Return Created',
        options: [
          { value: 'yesterday', label: 'Yesterday' },
          { value: 'last3days', label: 'Last 3 Days' },
          { value: 'last1week', label: 'Last 1 week' },
          { value: 'last2weeks', label: 'Last 2 weeks' },
          { value: 'last1month', label: 'Last 1 month' },
          { value: 'last3months', label: 'Last 3 months' },
          { value: 'custom', label: 'Custom Date Range' }
        ]
      },
      {
        group: 'Category',
        options: [
          { value: 'digitalpianos', label: 'Digital Pianos' },
          { value: 'homefragrance', label: 'Home Fragrance Lamps' },
          { value: 'tabletennis', label: 'Table Tennis Table Tennis Sets' },
          { value: 'keyboards', label: 'Electronic Keyboards' }
        ]
      },
      {
        group: 'Expected Delivery Date',
        options: [
          { value: 'tomorrow', label: 'Tomorrow' },
          { value: 'next3days', label: 'Next 3 day' },
          { value: 'next1week', label: 'Next 1 week' },
          { value: 'next2weeks', label: 'Next 2 weeks' },
          { value: 'next1month', label: 'Next 1 months' },
          { value: 'next3months', label: 'Next 3 months' },
          { value: 'custom', label: 'custom Date Range' }
        ]
      },
      {
        group: 'All Filters',
        options: [
          { value: 'returncreated', label: 'Return Created' },
          { value: 'category', label: 'Category' },
          { value: 'expecteddelivery', label: 'Expected Delivery Date' },
          { value: 'courierpartner', label: 'Courier Partner' },
          { value: 'returntype', label: 'Return Type' }
        ]
      }
    ],
    // 1: Out Of Delivery
    [
      {
        group: 'Status',
        options: [
          { value: 'deliveringtoday', label: 'Delivering Today' },
          { value: 'tobereattempted', label: 'To Be Reattempted' }
        ]
      },
      {
        group: 'Attempt',
        options: [
          { value: 'final', label: 'Final Attempt' },
          { value: 'second', label: '2nd Attempt' },
          { value: 'first', label: '1st Attempt' }
        ]
      },
      {
        group: 'All Filters',
        options: [
          { value: 'status', label: 'Status' },
          { value: 'attempt', label: 'Attempt' },
          { value: 'category', label: 'Category' },
          { value: 'courierpartner', label: 'Courier Partner' },
          { value: 'returntype', label: 'Return Type' },
          { value: 'returncreated', label: 'Return Created' }
        ]
      }
    ],
    // 2: Delivered
    [
      {
        group: 'Return Created',
        options: [
          { value: 'yesterday', label: 'Yesterday' },
          { value: 'last3days', label: 'Last 3 Days' },
          { value: 'last1week', label: 'Last 1 week' },
          { value: 'last2weeks', label: 'Last 2 weeks' },
          { value: 'last1month', label: 'Last 1 month' },
          { value: 'last3months', label: 'Last 3 months' },
          { value: 'custom', label: 'Custom Date Range' }
        ]
      },
      {
        group: 'Category',
        options: [
          { value: 'digitalpianos', label: 'Digital Pianos' },
          { value: 'homefragrance', label: 'Home Fragrance Lamps' },
          { value: 'tabletennis', label: 'Table Tennis Table Tennis Sets' },
          { value: 'keyboards', label: 'Electronic Keyboards' }
        ]
      },
      {
        group: 'Courier Partner',
        options: [
          { value: 'valmo', label: 'Valmo' },
          { value: 'shadofax', label: 'Shadofax' }
        ]
      },
      {
        group: 'Return Type',
        options: [
          { value: 'customer', label: 'Customer Return' },
          { value: 'courier', label: 'Courier Return' }
        ]
      }
    ],
    // 3: Lost
    [
      {
        group: 'Lost Date',
        options: [
          { value: 'yesterday', label: 'Yesterday' },
          { value: 'last3days', label: 'Last 3 Days' },
          { value: 'last1week', label: 'Last 1 week' },
          { value: 'last2weeks', label: 'Last 2 weeks' },
          { value: 'last1month', label: 'Last 1 month' },
          { value: 'last3months', label: 'Last 3 months' },
          { value: 'custom', label: 'Custom Date Range' }
        ]
      },
      {
        group: 'Category',
        options: [
          { value: 'digitalpianos', label: 'Digital Pianos' },
          { value: 'homefragrance', label: 'Home Fragrance Lamps' },
          { value: 'tabletennis', label: 'Table Tennis Table Tennis Sets' },
          { value: 'keyboards', label: 'Electronic Keyboards' }
        ]
      },
      {
        group: 'Courier Partner',
        options: [
          { value: 'valmo', label: 'Valmo' },
          { value: 'shadofax', label: 'Shadofax' }
        ]
      },
      {
        group: 'Return Type',
        options: [
          { value: 'customer', label: 'Customer Return' },
          { value: 'courier', label: 'Courier Return' }
        ]
      }
    ],
    // 4: Returnless Refund
    [
      {
        group: 'Return Created',
        options: [
          { value: 'yesterday', label: 'Yesterday' },
          { value: 'last3days', label: 'Last 3 Days' },
          { value: 'last1week', label: 'Last 1 week' },
          { value: 'last2weeks', label: 'Last 2 weeks' },
          { value: 'last1month', label: 'Last 1 month' },
          { value: 'last3months', label: 'Last 3 months' },
          { value: 'custom', label: 'Custom Date Range' }
        ]
      },
      {
        group: 'Category',
        options: [
          { value: 'digitalpianos', label: 'Digital Pianos' },
          { value: 'homefragrance', label: 'Home Fragrance Lamps' },
          { value: 'tabletennis', label: 'Table Tennis Table Tennis Sets' },
          { value: 'keyboards', label: 'Electronic Keyboards' }
        ]
      }
    ],
    // 5: Disposed
    [
      {
        group: 'Disposed Date',
        options: [
          { value: 'yesterday', label: 'Yesterday' },
          { value: 'last3days', label: 'Last 3 Days' },
          { value: 'last1week', label: 'Last 1 week' },
          { value: 'last2weeks', label: 'Last 2 weeks' },
          { value: 'last1month', label: 'Last 1 month' },
          { value: 'last3months', label: 'Last 3 months' },
          { value: 'custom', label: 'Custom Date Range' }
        ]
      },
      {
        group: 'Category',
        options: [
          { value: 'digitalpianos', label: 'Digital Pianos' },
          { value: 'homefragrance', label: 'Home Fragrance Lamps' },
          { value: 'tabletennis', label: 'Table Tennis Table Tennis Sets' },
          { value: 'keyboards', label: 'Electronic Keyboards' }
        ]
      },
      {
        group: 'Courier Partner',
        options: [
          { value: 'valmo', label: 'Valmo' },
          { value: 'shadofax', label: 'Shadofax' }
        ]
      },
      {
        group: 'All Filters',
        options: [
          { value: 'disposeddate', label: 'Disposed Date' },
          { value: 'category', label: 'Category' },
          { value: 'courierpartner', label: 'Courier Partner' },
          { value: 'returntype', label: 'Return Type' },
          { value: 'returncreated', label: 'Return Created' }
        ]
      }
    ]
  ];
  const [tab, setTab] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedRange, setSelectedRange] = React.useState('last1');
  const open = Boolean(anchorEl);
  const [trendOpen, setTrendOpen] = React.useState(false);

  // Section tab state for Return Tracking
  const [sectionTab, setSectionTab] = React.useState(0);
  // For each section tab and group, track anchor element for popover (2D array)
  const [sectionAnchorEls, setSectionAnchorEls] = React.useState<(HTMLElement | null)[][]>(
    sectionFilterOptions.map(groups => groups.map(() => null))
  );
  // For each section tab, track selected value for each group (array of arrays)
  // Each section tab has an array of selected filter values (strings), one per group
  const [sectionFilters, setSectionFilters] = React.useState<string[][]>([
    [], [], [], [], [], []
  ]);

  const [customDateRange, setCustomDateRange] = React.useState({ startDate: '', endDate: '' });
  const [customDatePopoverAnchor, setCustomDatePopoverAnchor] = React.useState<null | HTMLElement>(null);

  function handleCustomDateRangeClose() {
    setCustomDatePopoverAnchor(null);
  }

  function handleCustomDateApply() {
    console.log('Custom Date Range Applied:', customDateRange);
    setCustomDatePopoverAnchor(null);
  }

  function handleCustomDateReset() {
    setCustomDateRange({ startDate: '', endDate: '' });
  }
  
  // For each section tab, for each group, get label of selected value or default
//  function getSectionFilterLabel(tabIdx: number, groupIdx: number) {
//    const group = sectionFilterOptions[tabIdx][groupIdx];
//    const selectedVal = sectionFilters[tabIdx][groupIdx];
//    const found = group.options.find(opt => opt.value === selectedVal);
//    return found ? found.label : group.options[0]?.label || 'Select';
//  }
  // Handle filter change for a group in a section tab
  function handleSectionFilterChange(tabIdx: number, groupIdx: number, value: string) {
    setSectionFilters(prev => {
      const updated = prev.map(arr => [...arr]);
      updated[tabIdx][groupIdx] = value;
      return updated;
    });

    if (value === 'custom') {
      setCustomDatePopoverAnchor(sectionAnchorEls[tabIdx][groupIdx]); // Ensure the anchor is set correctly
    } else {
      setCustomDatePopoverAnchor(null); // Reset only if not "custom"
    }
  }
  // Open popover for a group in a section tab
  function handleOpenGroupPopover(tabIdx: number, groupIdx: number, event: React.MouseEvent<HTMLElement>) {
    setSectionAnchorEls(prev => {
      const arr = prev.map(inner => [...inner]);
      arr[tabIdx][groupIdx] = event.currentTarget;
      return arr;
    });

    // Reset custom date popover anchor when opening other group popovers
    setCustomDatePopoverAnchor(null);
  }
  // Close popover for a group in a section tab
  function handleCloseGroupPopover(tabIdx: number) {
    setSectionAnchorEls(prev => {
      const arr = prev.map(inner => [...inner]);
      // Close all popovers for this section tab
      for (let i = 0; i < arr[tabIdx].length; i++) {
        arr[tabIdx][i] = null;
      }
      return arr;
    });
  }

  // Map selectedRange to label
  const rangeLabel = selectedRange === 'last1' ? 'Last 1 Month' : selectedRange === 'last3' ? 'Last 3 Months' : 'Last 6 Months';
  return (
    <div>
        <Box sx={{ mt: 1  }}>
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          aria-label="Return Tabs"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ backgroundColor: '#fff', ml: -3, mr: -3, mb: 0.2, pl: 2,}}
        >
          <Tab label="Overview" />
          <Tab label="Return Tracking" />
          <Tab label="Claim Tracking" />
          <Tab label="Courier Partner" />
        </Tabs>
        </Box>
      {/* Filter bars for each tab */}
      {tab === 0 && (<>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, backgroundColor: '#fff', pl: 2, pr:2, pt:2, mb: 0, ml: -3, mr: -3 }}>
          <Typography variant="subtitle1">Summary</Typography>
          <Button
            variant="text"
            size="small"
            onClick={e => setAnchorEl(e.currentTarget)}
          >
            {rangeLabel} &nbsp;&nbsp; <CaretDownIcon  />
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setTrendOpen(true)}
            sx={{ marginLeft: 'auto' }}
          >
           <TrendUpIcon size={20} />  &nbsp;&nbsp;View Trend
          </Button>
          
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <Box sx={{ p: 2, minWidth: 180 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <input
                  type="radio"
                  name="dateRange"
                  value="last1"
                  checked={selectedRange === 'last1'}
                  onChange={() => setSelectedRange('last1')}
                />
                Last 1 Month
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <input
                  type="radio"
                  name="dateRange"
                  value="last3"
                  checked={selectedRange === 'last3'}
                  onChange={() => setSelectedRange('last3')}
                />
                Last 3 Months
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="radio"
                  name="dateRange"
                  value="last6"
                  checked={selectedRange === 'last6'}
                  onChange={() => setSelectedRange('last6')}
                />
                Last 6 Months
              </label>
            </Box>
          </Popover>

          {/* Trend Dialog */}
          {trendOpen && (
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                bgcolor: 'rgba(0,0,0,0.3)',
                zIndex: 1300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() => setTrendOpen(false)}
            >
              <Box
                sx={{ bgcolor: '#fff', p: 4, borderRadius: 2, minWidth: 320, minHeight: 180, boxShadow: 3 }}
                onClick={e => e.stopPropagation()}
              >
                <Typography variant="h6" mb={2}>Trend Analysis</Typography>
                <Typography variant="body2">(Placeholder for trend chart or data)</Typography>
                <Box sx={{ mt: 3, textAlign: 'right' }}>
                  <Button variant="contained" onClick={() => setTrendOpen(false)}>Close</Button>
                </Box>
              </Box>
            </Box>
          )}
          
        </Box>
        <Box sx={{ p: 2, backgroundColor: '#fff',  mt: 0, ml: -3, mr: -3 ,  display: 'flex', alignItems: 'center', gap: 2,}}>
         <Typography variant="subtitle1">Product Performance</Typography>
          <Typography variant="subtitle1" sx={{ marginLeft: 'auto' }}>Short By:</Typography>
         
      </Box></>
      )}
      {tab === 1 && (
        <>
          {/* Section Tabs for Return Tracking */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, backgroundColor: '#fff', p: 2, mb: -3, ml: -3, mr: -3 }}>
           
            {['In transit', 'Out Of Delivery', 'Deliverd', 'Lost', 'Returnless Refund', 'Disposed'].map((label, idx) => (
              <Button
                key={label}
                variant={sectionTab === idx ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setSectionTab(idx)}
              >
                {label}
              </Button>
            ))}
          </Box>
          <Divider sx={{ mt: 1, ml: -3, mr: -3 }} />
          {/* Filters for each section (grouped popover buttons) */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.2, backgroundColor: '#fff', p: 1, mt:0.2, mb:0, ml: -3, mr: -3 }}>
            <Typography variant="subtitle1" sx={{ minWidth: 80, p: 1, }}>Filter By:</Typography>
            {sectionFilterOptions[sectionTab].map((group, groupIdx) => (
              <React.Fragment key={group.group}>
                <Button
                  variant="text"
                  size="small"
                  onClick={e => handleOpenGroupPopover(sectionTab, groupIdx, e)}
                  sx={{ minWidth: 50 }}
                >
                  {group.group} {/*getSectionFilterLabel(sectionTab, groupIdx)*/} <CaretDownIcon />
                </Button>
                <Popover
                  open={Boolean(sectionAnchorEls[sectionTab][groupIdx])}
                  anchorEl={sectionAnchorEls[sectionTab][groupIdx]}
                  onClose={() => handleCloseGroupPopover(sectionTab)}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                >
                  <Box sx={{ p: 2, minWidth: 180 }}>
                    {group.options.map(opt => (
                      <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <input
                          type="radio"
                          name={`sectionFilter${sectionTab}-${groupIdx}`}
                          value={opt.value}
                          checked={sectionFilters[sectionTab][groupIdx] === opt.value}
                          onChange={() => handleSectionFilterChange(sectionTab, groupIdx, opt.value)}
                        />
                        {opt.label}
                      </label>
                    ))}
                    <Popover
                      open={Boolean(customDatePopoverAnchor)}
                      anchorEl={customDatePopoverAnchor}
                      onClose={handleCustomDateRangeClose}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    >
                      <Box sx={{ p: 2, minWidth: 240 }}>
                        <Typography variant="subtitle1" mb={1}>Select Custom Date Range</Typography>
                        <label style={{ display: 'block', marginBottom: 8 }}>
                          Start Date:
                          <input
                            type="date"
                            value={customDateRange.startDate}
                            onChange={e => setCustomDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                            style={{ marginLeft: 8 }}
                          />
                        </label>
                        <label style={{ display: 'block', marginBottom: 8 }}>
                          End Date:
                          <input
                            type="date"
                            value={customDateRange.endDate}
                            onChange={e => setCustomDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                            style={{ marginLeft: 8 }}
                          />
                        </label>
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                          <Button variant="contained" size="small" onClick={handleCustomDateApply}>
                            Apply
                          </Button>
                          <Button variant="outlined" size="small" onClick={handleCustomDateReset}>
                            Reset
                          </Button>
                        </Box>
                      </Box>
                    </Popover>
                    <Button
                      variant="outlined"
                      size="small"
                      color="secondary"
                      sx={{ mt: 1, width: '100%' }}
                      onClick={() => handleSectionFilterChange(sectionTab, groupIdx, '')}
                    >
                      Clear Filter
                    </Button>
                  </Box>
                </Popover>
              </React.Fragment>
            ))}
          </Box>
        </>
      )}
      {tab === 2 && (
        <Box sx={{ backgroundColor: '#fff', p: 2, pb: 8, ml: -3, mr: -3 }}>
         <Box sx={{    display: "flex",
             justifyContent: "center",
             alignItems: "center",
             flexDirection: "column",
             mt: 20,}}>
                    <Box sx={{ mr: 2 }}>
                        <ClamsSvg  />     
               </Box>
         
               {/* Texts */}
             <Box>
               <Typography variant="h6" fontWeight="bold" display="inline">
               Looking for Claim Tracking?
               </Typography>
               </Box><Box>
               <Button
                 variant="outlined"
                 onClick={() => setTab(2)}
                 size="small"
                 sx={{ marginLeft: 'auto' }}
               >
                 Go to Claims Tabs
               </Button>
            
          
             </Box>
                   
                     </Box>
        
         
        </Box>
      )}
      {tab === 3 && ( <>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, backgroundColor: '#fff', p: 2, ml: -3, mr: -3 }}>
         <Box sx={{ml:3}} >
         <Typography variant="h5">Customer Return Courier Partner Preference</Typography>
         <ul style={{ paddingLeft: 0, marginLeft: 35, maxWidth: 1600 , width: '100%' }}>
          <li>Decide the courier partner based on the details given below in the table</li>

              <li>Use set preference to define your sequence of preferred courier partners</li>

<li>Returns will be done using your defined preferred courier partner from this list, depending on their availability and capacity determined by Techpotli</li>
          </ul>
          <Typography >To know more visit <Button sx={{ml:-1, pl:-5, p:0 }}>FAQs</Button> </Typography>
          </Box>
             <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' , mr:5 }}>
            <Box sx={{ width: '100%', maxWidth: 300, height: 180, position: 'relative', mb: 0 }}>
                  <iframe width="300" height="180" src="https://www.youtube.com/embed/-AsTcISG_6k?list=RD-AsTcISG_6k" title="Sanson Ki Mala Pe | Amrita Kaur | Live in Concert | Virsa Heritage Revived" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                 </Box>
            </Box>
          
        </Box>

      <CourierPartnerTable/>
</>
      )}
    


    </div>
  )}
