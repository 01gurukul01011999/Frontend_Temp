'use client';
import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import {
  ShieldCheckIcon,
  ProhibitIcon,
  CurrencyInrIcon,
  BarcodeIcon,
  RecycleIcon,
} from '@phosphor-icons/react';

const barcodedFeatures = [
  {
    id: 1,
    title: "It's a 52 microns tamper-proof packet",
    icon: <ShieldCheckIcon color="white" size={20} weight="fill" />,
  },
  {
    id: 2,
    title: "3PL's will scan while picking & delivering ensuring double protection",
    icon: <BarcodeIcon color="white" size={20} weight="fill" />,
  },
  {
    id: 3,
    title: "Automatic claim approval on tampered packets",
    icon: <CurrencyInrIcon color="white" size={20} weight="fill" />,
  },
  {
    id: 4,
    title: "Supports scanning, fake packets will not be scannable",
    icon: <ProhibitIcon color="white" size={20} weight="fill" />,
  },
  {
    id: 5,
    title: "Packaging material of cancelled order can be reused using relinking",
    icon: <RecycleIcon color="white" size={20} weight="fill" />,
  },
];

export default function WhatIsBarcodedPackaging() {
  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: 'auto',
        mt: 2,
        p: 3,
        background: '#f9fafb',
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: 18,
          mb: 2,
          textAlign: 'center',
        }}
      >
        What is Barcoded Packaging?
      </Typography>

      <List dense>
        {barcodedFeatures.map((item) => (
          <ListItemButton
            key={item.id}
            disableRipple
            sx={{
              alignItems: 'flex-start',
              mb: 1,
              borderRadius: 1,
              textAlign: 'left',
              width: '100%',
              padding: 0,
              '&:hover': { background: '#e0e7ff' },
            }}
          >
            <ListItemAvatar>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: '#0034a5',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1,
                }}
              >
                {item.icon}
              </Box>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                  {item.title}
                </Typography>
              }
            />
          </ListItemButton>
        ))}
      </List>


    </Box>
  );
}
