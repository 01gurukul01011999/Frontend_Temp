'use client';
import React from 'react';
import { Box, Typography, Button, Stack } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function WarehousingCard() {
  return (
    <Box
      sx={{
        display: "flex",
        p: 3,
     
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        mt:0.5,
        ml: -3,
        mr: -3,

      }}
    >
      {/* Left: Text & Steps */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Join Meesho Warehousing in 4 easy steps!
        </Typography>

        <Stack spacing={1} mb={3}>
          <StepItem text='Click on "Join Us Now" button below' />
          <StepItem text="Complete GST and APOB registration (We'll help you)" />
          <StepItem text="Dispatch inventory to the warehouse" />
          <StepItem text="Watch your business takeoff on Meesho" />
        </Stack>

        <Stack direction="row" spacing={2}>
          <Button variant="contained" sx={{ bgcolor: "#542deb", textTransform: "none" }}>
            Join Us Now
          </Button>
          <Button variant="outlined" sx={{ textTransform: "none" }}>
            Request Callback
          </Button>
        </Stack>
      </Box>

      {/* Right: Video/Image */}
      <Box sx={{ ml: 3 , width:'448px', height:'220px'}}>
           <iframe
    width='100%'
    height='100%'
    src="https://www.youtube.com/embed/lgQLdXeQyqM?list=RDlgQLdXeQyqM"
    title="vedio title"
    frameBorder={0}
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerPolicy="strict-origin-when-cross-origin"
  
  />
          
          </Box>
    </Box>
  );
}

interface StepItemProps {
  text: string;
}

function StepItem({ text }: StepItemProps) {
  return (
    <Stack direction="row" alignItems="flex-start" spacing={1}>
      <CheckCircleIcon sx={{ color: "#00b96b", mt: "2px", fontSize: 20 }} />
      <Typography variant="body2">{text}</Typography>
    </Stack>
  );
}
