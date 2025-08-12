'use client';
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';

const vendors = [
  {
    name: 'Parin Polymers',
    location: 'Chandigarh',
    price: '₹2.03/packet',
    note: 'Transparent packet available',
    logo: 'https://images.meeshosupplyassets.com/fulfillment/barcoded-packaging/parin_polymers.svg',
  },
  {
    name: 'Euphoria Packaging',
    location: 'Ahmedabad',
    price: '₹2.04/packet',
    note: 'Transparent packet available',
    logo: 'https://images.meeshosupplyassets.com/fulfillment/barcoded-packaging/euphoria.svg',
  },
  {
    name: 'Global Parachem',
    location: 'Ghaziabad',
    price: '₹2.04/packet',
    note: 'Transparent packet available',
    logo: 'https://images.meeshosupplyassets.com/fulfillment/barcoded-packaging/global_parachem.svg',
  },
  {
    name: 'Shri Anand Polymers',
    location: 'Gurgaon',
    price: '₹2.04/packet',
    note: 'Transparent packet available',
    logo: 'https://images.meeshosupplyassets.com/fulfillment/barcoded-packaging/shri_anand_polymers.svg',
  },
  {
    name: 'PicknPack',
    location: 'New Delhi',
    price: '₹2.04/packet',
    note: 'Transparent packet available',
    logo: 'https://images.meeshosupplyassets.com/fulfillment/barcoded-packaging/picknpack.svg',
  },
  {
    name: 'Pacfo',
    location: 'Surat',
    price: '₹2.06/packet',
    note: 'Transparent packet available',
    logo: 'https://images.meeshosupplyassets.com/fulfillment/barcoded-packaging/pacfo.svg',
  },
  {
    name: 'Krishna Polymers',
    location: 'Ajmer',
    price: '₹2.08/packet',
    note: 'Transparent packet available',
    logo: 'https://images.meeshosupplyassets.com/fulfillment/barcoded-packaging/krishna_polymers.svg',
  },
  {
    name: 'Maruthi Plastics',
    location: 'Chennai',
    price: '₹2.20/packet',
    note: 'Transparent packet available',
    logo: 'https://images.meeshosupplyassets.com/fulfillment/barcoded-packaging/maruthi_plastics.svg',
  },
];

export default function Vendors() {
  return (
    <Box sx={{mt:1, px: 2, py: 5, maxWidth: '1200px', mx: 'auto', backgroundColor: '#ffff', mr: -3, ml: -3 }}>
      <Typography variant="h6" fontWeight={700} mb={1}>
        Techpotli Authorised Vendors
      </Typography>
      <Typography sx={{ mb: 4, color: '#666' }}>
        Buying packets from unauthorised outside vendors will lead RTO & Returns Claims blocking and may lead to account suspension
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
          gap: 2,
        }}
      >
        {vendors.map((vendor, idx) => (
          <Card key={idx} variant="outlined" sx={{ p: 1, minHeight: 150 }}>
            <CardContent>
              <Box sx={{ mb: 1 }}>
                <img src={vendor.logo} alt={vendor.name} height={30} />
              </Box>
              <Typography fontWeight={600}>{vendor.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {vendor.location}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                Starting at <strong>{vendor.price}</strong> <span style={{ fontSize: 12 }}>(size 10x14)</span>
              </Typography>
              <Typography sx={{ fontSize: 12, color: 'gray', mb: 1 }}>{vendor.note}</Typography>
              <Button
                variant="outlined"
                size="small"
                sx={{ color: '#3b3ef5', borderColor: '#3b3ef5', textTransform: 'none' }}
              >
                Buy Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
