'use client';
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Modal,
  Button,
  IconButton,
  Divider
} from '@mui/material';
import Image from 'next/image';
import CloseIcon from '@mui/icons-material/Close';

export default function BarcodedPackaging(): React.JSX.Element {
  const [open, setOpen] = useState(false);

  const vendors = [
    {
      name: 'Parin Polymers',
      location: 'Chandigarh',
      sizes: 9,
      price: 'Rs 2.03 per packet',
    },
    {
      name: 'Euphoria Packaging',
      location: 'Ahmedabad',
      sizes: 15,
      price: 'Rs 2.04 per packet',
    },
    {
      name: 'Global Parachem',
      location: 'Ghaziabad',
      sizes: 7,
      price: 'Rs 2.04 per packet',
    },
    {
      name: 'Shri Anand Polymers',
      location: 'Gurgaon',
      sizes: 9,
      price: 'Rs 2.04 per packet',
    },
    {
      name: 'PicknPack',
      location: 'New Delhi',
      sizes: 16,
      price: 'Rs 2.02 per packet',
    },
    {
      name: 'Pacfo',
      location: 'Surat',
      sizes: 11,
      price: 'Rs 2.03 per packet',
    },
    {
      name: 'Krishna Polymers',
      location: 'Ajmer',
      sizes: 9,
      price: 'Rs 2.01 per packet',
    },
    {
      name: 'Maruthi Plastics',
      location: 'Chennai',
      sizes: 16,
      price: 'Rs 2.05 per packet',
    }
  ];

  return (
     <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        padding: 2,
        mt: 1,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        mr: -3,
        ml: -3,
      }}
    >
      {/* Left: Icon + Info Text */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
        <Box
          component="img"
          src="https://images.meeshosupplyassets.com/fulfillment/branded_packet.svg" // Replace with your icon path
          alt="Barcoded Packaging"
          sx={{ width: 40, height: 40 }}
        />
        <Typography sx={{ fontSize: 14 }}>
          <Box component="span" sx={{ fontWeight: 700 }}>
            As per Techpotli packaging policy,
          </Box>{' '}
          all sellers must use{' '}
          <Box component="span" sx={{ fontWeight: 700 }}>
            Transparent Barcoded Packaging
          </Box>{' '}
          for their products on the platform.
        </Typography>
      </Box>

      {/* Right: Action Buttons */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="outlined"
          onClick={() => setOpen(true)}
          sx={{
            fontSize: 13,
            textTransform: 'none',
            borderColor: '#3730a3',
            color: '#3730a3',
            fontWeight: 600,
            '&:hover': {
              borderColor: '#3730a3',
              backgroundColor: '#eef2ff',
            },
          }}
        >
          Buy Barcoded Packets
        </Button>
        <Button
          variant="outlined"
            onClick={() => {
              // Navigate to return order page
              globalThis.location.href = '/dashboard/order/barcode-scan';
            }}
          sx={{
            fontSize: 13,
            textTransform: 'none',
            borderColor: '#3730a3',
            color: '#3730a3',
            fontWeight: 600,
            '&:hover': {
              borderColor: '#3730a3',
              backgroundColor: '#eef2ff',
            },
            
          }}
        >
          Scan Barcoded Packets
        </Button>
      </Box>
    

      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 900,
            bgcolor: '#fff',
            borderRadius: 3,
            boxShadow: 24,
            p: 3,
          maxHeight: '90vh',
          overflowY: 'auto',
         
          }}
        >
          {/* Modal Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between'  }}>
            <Typography variant="h6" fontWeight={700}>
              Why use Barcoded Packets?
            </Typography>
            <IconButton onClick={() => setOpen(false)} sx={{ mt: -2 }}>
              <CloseIcon />
            </IconButton>
          </Box>
<Box sx={{ mt: 0, mb: 1 ,  display: 'flex',  flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          alignItems: 'flex-start',}}>
              <Box sx={{ mr: 2 }}>
            <Image
              src="https://images.meeshosupplyassets.com/fulfillment/packet.svg"
              alt="Packet Icon"
              width={60}
              height={60}
            />
          </Box>
          {/* Benefits */}
          <Box sx={{ mt: 0 }}>
            <Typography fontSize={14}>
              ✅ Barcoded packets are tamperproof and protect the shipments from fraud.
            </Typography>
            <Typography fontSize={14} mt={1}>
              📦 It&apos;s mandatory to scan the AWB & QR code before dispatching to be eligible to raise RTO and Customer Return.
            </Typography>
          </Box>

         {/* Right: YouTube Video */}
        <Box
          sx={{
            width: 280,
            height: 120, 
            mt:-1
          }}
        >
          <iframe width="100%" 
          height="100%" 
          src="https://www.youtube.com/embed/-aDIExof4AU?list=RD-aDIExof4AU" 
          title="Shiv Bhajan - Bhakti Song" 
         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; 
         picture-in-picture; web-share"  ></iframe>
        </Box>
</Box>
          <Divider sx={{ my: 1 }} />

          {/* Scanner Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 , border: '1px solid #ccc', p: 2, borderRadius: 2, mt: 2 }}>
            <Image src="https://images.meeshosupplyassets.com/fulfillment/scanning_device.svg" alt="Scanner" width={30} height={30} />
            <Typography fontSize={14}>
              To scan the packets using your Desktop/Laptop, a 2D scanning device that supports scanning of Barcode and QR Code will be needed
            </Typography>
          </Box>

          {/* Vendor Cards */}
          <Typography fontWeight={600} mt={2} mb={2}>
            Authorised Vendors
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              justifyContent: 'flex-start',
            }}
          >
            {vendors.map((vendor) => (
              <Box
                key={vendor.name}
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: 2,
                  p: 2,
                  width: { xs: '100%', sm: '48%', md: 'calc(50% - 1rem)' },
                }}
              >
                <Typography fontWeight={600}>{vendor.name}</Typography>
                <Typography fontSize={13}>Location: {vendor.location}</Typography>
                <Typography fontSize={13}>Sizes available: {vendor.sizes}</Typography>
                <Typography fontSize={13}>Popular Size: 10x14</Typography>
                <Typography fontSize={13}>Price: {vendor.price}</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    mt: 1,
                    textTransform: 'none',
                    fontSize: 13,
                    borderColor: '#6366f1',
                    color: '#6366f1',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: '#eef2ff',
                      borderColor: '#6366f1',
                    },
                  }}
                >
                  Buy Now
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
