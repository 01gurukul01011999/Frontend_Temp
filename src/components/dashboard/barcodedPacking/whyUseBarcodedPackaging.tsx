'use client';
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Avatar,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';

const featureRows = [
  { label: 'Security from Fraud', transparent: true, regular: false },
  { label: 'Wrong RTO Reduction', transparent: true, regular: false },
  { label: 'Wrong Return Reduction', transparent: true, regular: false },
  { label: 'Eligible for RTO Claims', transparent: true, regular: false },
];

const testimonials = [
  {
    name: 'Leemboodi fashion',
    date: 'Since Jan ‘22',
    review:
      'I am very happy with Meesho Transparent bags. RTO Frauds have reduced by 20%, and RTO Approvals have gone up to 80%',
    avatar: 'https://via.placeholder.com/40x40?text=L',
  },
  {
    name: 'Kanooda Prints',
    date: 'Since Apr ‘22',
    review:
      'Wrong RTO has reduced by 50%, and it ensures us that our product will reach safely to the Meesho customer',
    avatar: 'https://via.placeholder.com/40x40?text=K',
  },
];

export default function WhyUseBarcodedPackaging() {
  return (<>
    <Box sx={{ py: 6, px: 2, maxWidth: '1200px', mx: 'auto', backgroundColor: '#ffff', mr: -3, ml: -3, mt:2 }}>
      <Typography variant="h5" fontWeight={700} textAlign="center" gutterBottom>
        Why use Barcoded Packaging?
      </Typography>
      <Typography textAlign="center" sx={{ mb: 4, color: '#555' }}>
        Use Barcoded Packaging on 100% of orders to get maximum protection
      </Typography>

      {/* Layout: Side by Side */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
        }}
      >
        {/* Left - Comparison Table */}
        <Box
          sx={{
            flex: 1,
            background: '#e8f0ff',
            p: 3,
            borderRadius: 4,
          }}
        >
          <Box sx={{ display: 'flex', mb: 2 , ml:25}}>
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={700}>
                Transparent<br />Barcoded Packet
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={700}>
                Regular Packet<br />from Open Market
              </Typography>
            </Box>
          </Box>

          {featureRows.map((row, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                py: 1.2,
                borderTop: '1px solid #ccc',
                alignItems: 'center',
              }}
            >
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', pr: 1  }}>
                <Typography sx={{ flexGrow: 1 , width: 250}}>{row.label}</Typography>
                <Box sx={{ width: 20, textAlign: 'center' }}>
                {row.transparent ? (
                  <CheckCircleOutlineIcon color="success" />
                ) : (
                  <CancelIcon color="error" />
                )}
                </Box>
              </Box>
              <Box sx={{ flex: 1 , ml:15}}>
                {row.regular ? (
                  <CheckCircleOutlineIcon color="success" />
                ) : (
                  <CancelIcon color="error" />
                )}
              </Box>
            </Box>
          ))}

          {/* CTA Button */}
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              sx={{
                background: '#3b3ef5',
                color: 'white',
                fontWeight: 600,
                textTransform: 'none',
                px: 3,
                py: 0.5,
                fontSize: 14,
                borderRadius: 1,
              }}
            >
              Buy Now
            </Button>
            <Typography sx={{ fontSize: 11, mt: 1, color: '#f97316' }}>
              *Sensitive category products will only be allowed in non-transparent barcoded packets.{' '}
              <Box component="span" sx={{ color: '#2563eb', cursor: 'pointer' }}>
                Know more
              </Box>
            </Typography>
          </Box>
        </Box>

        {/* Right - Testimonials */}
        <Box sx={{ flex: 1 }}>
          <Typography fontWeight={700} sx={{ mb: 2 }}>
            Over 20,000+ Sellers are using Transparent Barcoded Packaging
          </Typography>

          {testimonials.map((item, idx) => (
            <Box key={idx} sx={{ mb: 3 }}>
              <Typography
                sx={{
                  fontStyle: 'italic',
                  mb: 1,
                  position: 'relative',
                  pl: 2,
                }}
              >
                “{item.review}”
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar src={item.avatar} />
                <Box>
                  <Typography fontSize={14} fontWeight={600}>
                    {item.name}
                  </Typography>
                  <Typography fontSize={12} color="gray">
                    {item.date}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
       <Typography
        sx={{
          fontWeight: 700,
          fontSize: 18,
          mb: 2,
            mt: 5,
          textAlign: 'center',
        }}
      >
       How to Scan Barcoded Packaging?
      </Typography>

      <Box
        sx={{
          display: 'flex',
        gap: 4,
        backgroundColor: '#f1f5ff',
        borderRadius: 2,
        padding: 2,
        alignItems: 'center',
        flexDirection: { xs: 'column', sm: 'row' },
        mr:20,
        ml:20,
        }}  
        >
 {/* Desktop QR Instruction */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
        <Box
          component="img"
          src="https://images.meeshosupplyassets.com/fulfillment/barcoded-packaging/scanning_gun.svg" // replace with actual image path
          alt="USB QR Scan"
          sx={{ width: 40, height: 40 }}
        />
        <Typography sx={{ fontSize: 14 }}>
          Scan on desktop by connecting a{' '}
          <Box component="span" sx={{ fontWeight: 700 }}>
            USB 2D QR
          </Box>{' '}
          scanning device
        </Typography>
      </Box>

      {/* Mobile QR Instruction */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
        <Box
          component="img"
          src="https://images.meeshosupplyassets.com/fulfillment/barcoded-packaging/mobile_scan.svg" // replace with actual image path
          alt="Mobile QR Scan"
          sx={{ width: 40, height: 40 }}
        />
        <Typography sx={{ fontSize: 14 }}>
          Scan on smartphone by opening{' '}
          <Box component="span" sx={{ fontWeight: 700 }}>
            seller panel
          </Box>{' '}
          on <Box component="span" sx={{ fontWeight: 700 }}>mobile browser</Box>
        </Typography>
      </Box>



            </Box>

        
    </Box>

     <Box
        sx={{
          display: 'flex',
        gap: 4,
        backgroundColor: '#ffff',
        padding: 2,
        alignItems: 'center',
        flexDirection: { xs: 'column', sm: 'row' },
        mr:-3,
        ml:-3,
        mt: 1,
        }}  
        >
 {/* Desktop QR Instruction */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 , ml:10}}>
        <Box
          component="img"
          src="https://images.meeshosupplyassets.com/fulfillment/barcoded-packaging/tp_package.svg" // replace with actual image path
          alt="USB QR Scan"
          sx={{ width: 40, height: 40 }}
        />
        <Typography sx={{ fontSize: 14 }}>
          Use Transparent Barcoded Packaging to protect your orders against courier fraud
        </Typography>
      </Box>

      {/* Mobile QR Instruction */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 , mr:10 }}>
        <Box
          component="img"
          src="https://images.meeshosupplyassets.com/fulfillment/barcoded-packaging/non_tp_package.svg" // replace with actual image path
          alt="Mobile QR Scan"
          sx={{ width: 40, height: 40 }}
        />
        <Typography sx={{ fontSize: 14 }}>
          Selling sensitive category items? Use Non-Transparent Barcoded Packaging to pack orders
        
        </Typography>
      </Box>



            </Box>

            </>

  );
}
