import React from 'react'
import {
  Box,
  Button,
  Typography,
  Paper,
} from '@mui/material';

function Add(): React.JSX.Element {
  return (
    <Box>
        {/* Top Banner */}
      <Paper elevation={1} sx={{borderRadius:0, backgroundColor: '#ffeae2', p: 3, mb:0.5, mt:1, mr:-3,ml:-3, display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            Get upto 50% more orders + upto 10% lesser returns
          </Typography>
          <Typography variant="body2">
            Add/ edit the catalogs and improve the quality. Plus, prevent catalogs from deactivations/ low visibility *T&C
          </Typography>
        </Box>
        <Button variant="contained" sx={{ backgroundColor: '#4d0aff', ':hover': { backgroundColor: '#3a08cc' } }}>
          Improve products here
        </Button>
      </Paper>
    </Box>
  )
}

export default Add