'use client';
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
          zIndex: 1300, // Ensures it's on the top layer
          boxShadow: '0 -2px 8px rgba(0,0,0,0.08)',
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
          onClick={() => globalThis.history.back()}
        >
          Discard Catalog
        </Button>
            </Box>
      
        </>
    );
}
