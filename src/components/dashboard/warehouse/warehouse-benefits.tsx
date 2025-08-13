'use client';
import React from 'react';
import { Box, Typography, Avatar } from "@mui/material";

export default function WarehouseBenefits(): React.JSX.Element {
  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
        p: 4,
        backgroundColor: "#fff",
        mt:1,
        ml: -3,
        mr: -3,
      }}
    >
      <Typography variant="h6" fontWeight="bold" textAlign="center" mb={4}>
        Benefits of Meesho Warehouse
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: 3,
        }}
      >
        <BenefitItem
          icon="https://cdn-icons-png.flaticon.com/512/1828/1828884.png"
          title="Grow Sales by 9%-11%"
          description="Benefits from Meesho’s upto Rs 5 customer discount without affecting your margins"
        />
        <BenefitItem
          icon="https://cdn-icons-png.flaticon.com/512/891/891399.png"
          title="100% Protection from RTO & Return Frauds"
          description="Enjoy peace of mind with guaranteed approval on all valid claims"
        />
        <BenefitItem
          icon="https://cdn-icons-png.flaticon.com/512/709/709496.png"
          title="Reduce Returns, RTOs & Cancellations by 6-7%"
          description="Reduce damage related returns with our expert handling"
        />
        <BenefitItem
          icon="https://cdn-icons-png.flaticon.com/512/747/747376.png"
          title="Supercharge Operations"
          description="Access real-time inventory tracking and performance insights"
        />
      </Box>
    </Box>
  );
}

interface BenefitItemProps {
  icon: string;
  title: string;
  description: string;
}

function BenefitItem({ icon, title, description }: BenefitItemProps) {
  return (
    <Box sx={{ display: "flex", width: "48%", alignItems: "flex-start" }}>
      <Avatar
        src={icon}
        variant="rounded"
        sx={{ width: 48, height: 48, bgcolor: "#f5f5f5", mr: 2 }}
      />
      <Box>
        <Typography variant="subtitle1" fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Box>
  );
}

