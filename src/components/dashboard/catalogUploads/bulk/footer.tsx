import React from "react";
import {
  Box,
  Button,
} from '@mui/material';
export default function Footer(): React.JSX.Element {
    return (
        <>
        <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 20,
          backgroundColor: '#ffffff',
          padding: '8px 16px',
          width: '100%',
        }}
      >
        <Button
          variant="outlined"
          sx={{
            color: '#4d0aff',
            borderColor: '#4d0aff',
            fontWeight: 'bold',
            textTransform: 'none',
          }}
          onClick={() => window.history.back()}
        >
          Discard Catalog
        </Button>
      </Box>
      
        </>
    );
}
