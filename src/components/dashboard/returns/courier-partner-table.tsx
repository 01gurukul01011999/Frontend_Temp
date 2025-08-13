import React from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';

function CourierPartnerTable(): React.JSX.Element {
  const [rateCardAnchorEl, setRateCardAnchorEl] = React.useState<null | HTMLElement>(null);
  const rateCardOpen = Boolean(rateCardAnchorEl);
  const [editMode, setEditMode] = React.useState(false);
  const [preferences, setPreferences] = React.useState([
    '1st Preference',
    '2nd Preference',
    '3rd Preference',
    '4th Preference',
    '5th Preference',
  ]);

  const preferenceOptions = [
    '1st Preference',
    '2nd Preference',
    '3rd Preference',
    '4th Preference',
    '5th Preference',
  ];

  // ...existing code...
  return (
    <>
         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, backgroundColor: '#fff', p: 2, mt: 1, ml: -3, mr: -3 }}>
          <Box><Typography variant='h5' sx={{fontWeight:'700'}}>My Courier Partners for Customer Returns</Typography>
            <Typography variant='subtitle2' >Last 1 month&#39;s customer returns performance in your PIN Code</Typography> 
            </Box><Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto', mr: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ ml: 'auto' }}
                  onClick={e => setRateCardAnchorEl(e.currentTarget)}
                >
                  <Typography variant='body1' sx={{fontSize:'12'}}>View Rate Card</Typography>
                </Button>
                {rateCardOpen && (
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
                    onClick={() => setRateCardAnchorEl(null)}
                  >
                    <Box
                      sx={{ bgcolor: '#fff', p: 4, borderRadius: 2, minWidth: 400, boxShadow: 3 }}
                      onClick={e => e.stopPropagation()}
                    >
                      <Typography variant="h5" sx={{ mb: 2 }}>Courier Partner Rate Card</Typography>
                      <Divider sx={{ mb: 1 , mr:-3, ml:-3}} />
                      <Typography variant="body1" sx={{fontWeight:'750'}} >
                         Reverse shipping charges (Including GST) based on parcel weight.</Typography>
     <Typography variant="subtitle2" >
     Charges applicable include reverse shipping costs of logistics partner, other platform fees/charges (as may be applicable to you) and applicable taxes
                         </Typography>
                      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd', textAlign: 'center' }}>
                        <thead>
                          <tr style={{ background: '#f5f5f5' }}>
                            <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 600 }}>Courier Partner</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 600 }}>Upto 500gm</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 600 }}>501-1000gm</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 600 }}>1001-1500gm</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 600 }}>1501-2000gm</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 600 }}>2001-2500gm</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Courier Partner 1</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>₹30</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>₹35</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>₹40</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>₹45</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>₹50</td>
                          </tr>
                          <tr>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Courier Partner 2</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>₹28</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>₹33</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>₹38</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>₹43</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>₹48</td>
                          </tr>
                          <tr>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Courier Partner 3</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>₹27</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>₹32</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>₹37</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>₹42</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>₹47</td>
                          </tr>
                        </tbody>
                      </table>
                      <Box sx={{ mt: 3, textAlign: 'right' }}>
                        <Button variant="contained" onClick={() => setRateCardAnchorEl(null)}>Close</Button>
                      </Box>
                    </Box>
                  </Box>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ ml: 'auto' }}
                  onClick={() => setEditMode(!editMode)}
                >
                  <Typography variant='body1' sx={{fontSize:'12'}}>{editMode ? 'Save' : 'Edit My Choice'}</Typography>
                </Button>
            </Box>
         </Box>
         <Box sx={{ backgroundColor: '#fff', pl: 2, pr: 2, ml: -3, mr: -3 }}> 
             <Box sx={{ overflowX: 'auto' }}>
               <table style={{ textAlign:'center' , width: '100%', borderCollapse: 'collapse', minWidth: 800 , border: '1px solid #ddd'}}>
                 <thead >
                   <tr style={{ borderBottom: '2px solid #ddd'  }}>
                 <th style={{ border: '1px solid #ddd', textAlign: 'center', padding: '8px', background: '#f5f5f5', fontWeight: 600 }}>Preference</th>
                 <th style={{ border: '1px solid #ddd', textAlign: 'center', padding: '8px', background: '#f5f5f5', fontWeight: 600 }}>Courier Partner</th>
                 <th style={{ border: '1px solid #ddd', textAlign: 'center', padding: '8px', background: '#f5f5f5', fontWeight: 600 }}>Reverse Shipping Charges</th>
                 <th style={{ border: '1px solid #ddd', textAlign: 'center', padding: '8px', background: '#f5f5f5', fontWeight: 600 }}>Avg Return Time (Days)</th>
                 <th style={{ border: '1px solid #ddd', textAlign: 'center', padding: '8px', background: '#f5f5f5', fontWeight: 600 }}>Claims Raised</th>
                 <th style={{ border: '1px solid #ddd', textAlign: 'center', padding: '8px', background: '#f5f5f5', fontWeight: 600 }}>Courier Partner Claim Approval %</th>
                   </tr>
                 </thead>
                 <tbody>
                   {[1,2,3,4,5].map((row, idx) => (
                     <tr key={row}>
                       <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                         {editMode ? (
                           <select
                             value={preferences[idx]}
                             onChange={e => {
                               const newPrefs = [...preferences];
                               newPrefs[idx] = e.target.value;
                               setPreferences(newPrefs);
                             }}
                             style={{ padding: '4px', fontSize: '14px', width: '100%' }}
                           >
                             {preferenceOptions.map(opt => (
                               <option key={opt} value={opt}>{opt}</option>
                             ))}
                           </select>
                         ) : (
                           preferences[idx]
                         )}
                       </td>
                       <td style={{ border: '1px solid #ddd', padding: '8px' }}>Courier Partner {row}</td>
                       <td style={{ border: '1px solid #ddd', padding: '8px' }}>₹{50-5*(row-1)}</td>
                       <td style={{ border: '1px solid #ddd', padding: '8px' }}>{2+row}</td>
                       <td style={{ border: '1px solid #ddd', padding: '8px' }}>{14-2*row}</td>
                       <td style={{ border: '1px solid #ddd', padding: '8px' }}>{90-5*(row-1)}%</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </Box>
             <Divider sx={{ my: 2 }} />
         
             </Box>
         </>
       )
     }

export default CourierPartnerTable;
