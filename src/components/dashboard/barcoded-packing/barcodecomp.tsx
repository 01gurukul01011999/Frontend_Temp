
'use client';
import React from 'react';
import Image from 'next/image';

import {
  Box,
  Button,
  Stack,
  Typography,
} from '@mui/material'; // If using Next.js, otherwise replace with <img />

export default function Barcodecomp():React.JSX.Element {
  return (
    <Box sx={{ p: 4, backgroundColor: '#f5faff', mt: 0.5, ml: -3, mr: -3 }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={4}
        alignItems="center"
        justifyContent="space-between"
      >
        {/* Left Section */}
        <Box flex={1}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Protect orders with <span style={{ color: '#000' }}>Barcoded Packaging</span>
          </Typography>
          <Typography sx={{ mb: 3 }}>
            Safeguarding every delivery: our defense against courier fraud
          </Typography>

          <Stack spacing={2} sx={{ mb: 3 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Image src="https://images.meeshosupplyassets.com/fulfillment/barcoded-packaging/red_round_alert.svg" alt="!" width={20} height={20} />
        <Typography>
        It is <strong>mandatory</strong> to pack and scan orders in <strong>transparent Barcoded Packaging</strong>
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center">
        <Image src="https://images.meeshosupplyassets.com/fulfillment/barcoded-packaging/mobile_scan.svg" alt="phone" width={20} height={20} />
        <Typography>
        Scan on smartphone by opening <strong>seller panel</strong> on <strong>mobile browser</strong>
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center">
        <Image src="https://images.meeshosupplyassets.com/fulfillment/barcoded-packaging/scanning_gun.svg" alt="usb" width={20} height={20} />
        <Typography>
        Scan on desktop by connecting a <strong>USB 2D QR</strong> scanning device
        </Typography>
      </Stack>
          </Stack>

          <Button variant="contained" sx={{ backgroundColor: '#4b00ff' }}>
            Buy Now
          </Button>
        </Box>

        {/* Right Section: YouTube Thumbnail */}
        <Box flex={1} sx={{ textAlign: 'center' }}>
          <iframe
            width="100%"
            height="240"
            src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
            title="Barcoded Packaging Video"
            frameBorder="0"
            allowFullScreen
            style={{ borderRadius: '12px' }}
          ></iframe>
        </Box>
      </Stack>
    </Box>
  );
}
