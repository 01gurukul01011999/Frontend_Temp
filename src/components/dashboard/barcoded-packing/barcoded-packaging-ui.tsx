'use client';
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab
} from "@mui/material";
import { LineChart, XAxis, YAxis, Tooltip, Area, Line } from "recharts";

const dataUsage = [
  { name: "Feb", value: 60 },
  { name: "Mar", value: 62 },
  { name: "Apr", value: 65 },
  { name: "May", value: 70 },
  { name: "June", value: 72 },
  { name: "July", value: 71 },
];

const dataWrongRTO = [
  { name: "Feb", value: 1.1 },
  { name: "Mar", value: 1.2 },
  { name: "Apr", value: 1.3 },
  { name: "May", value: 1.2 },
  { name: "June", value: 1 },
  { name: "July", value: 0.8 },
];

const dataRTOClaims = [
  { name: "Feb", value: 78 },
  { name: "Mar", value: 77 },
  { name: "Apr", value: 75 },
  { name: "May", value: 76 },
  { name: "June", value: 78 },
  { name: "July", value: 75 },
];

export default function BarcodedPackagingUI():React.JSX.Element {
  const [tab, setTab] = useState(2);

  return (
    <Box sx={{ p: 3, backgroundColor: "#ffff", mt: 0.5, ml: -3, mr: -3 }}>
      <h2 className="text-2xl font-bold mb-4">
        Benefits other sellers are getting using Barcoded Packaging
      </h2>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mb: 2 }}
      >
        <Tab label="30 Days" value={0} />
        <Tab label="3 Months" value={1} />
        <Tab label="6 Months" value={2} />
      </Tabs>

      {/* Inline cards with charts */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          mb: -2,
        }}
      >
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <h3 className="text-md font-semibold mb-2">Barcoded Packaging Usage</h3>
            <LineChart width={250} height={150} data={dataUsage}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#22c55e" fill="#bbf7d0" />
              <Line type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={2} dot={false} />
            </LineChart>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <h3 className="text-md font-semibold mb-2">Wrong RTOs Reduced</h3>
            <LineChart width={250} height={150} data={dataWrongRTO}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#f97316" fill="#fed7aa" />
              <Line type="monotone" dataKey="value" stroke="#ea580c" strokeWidth={2} dot={false} />
            </LineChart>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <h3 className="text-md font-semibold mb-2">RTO claims Approved</h3>
            <LineChart width={250} height={150} data={dataRTOClaims}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#ec4899" fill="#fbcfe8" />
              <Line type="monotone" dataKey="value" stroke="#db2777" strokeWidth={2} dot={false} />
            </LineChart>
          </CardContent>
        </Card>
      </Box>

    
      <CardContent>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 0 }}>
        Total amount saved by all the sellers using Barcoded Packaging:
        <Typography component="span" color="success.main" fontWeight={700} fontSize="1.7rem" sx={{ ml: 1 }}>
          ₹87,28,51,874
        </Typography>
        <a style={{ color: "#2563eb", textDecoration: "underline", fontSize: 14, marginLeft: 12 }}>
          View Details
        </a>
        </Typography>
      </CardContent>
  

    <Card sx={{ background: "#fef9c3", border: "1px solid #fde68a", borderRadius: 2,  mt: -2 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
        ⚠️ Start using Barcoded Packaging to pack and scan orders
        </Typography>
        <Typography variant="body2" sx={{ color: "#374151", mb: -2 }}>
        Pack all of your orders in Barcoded Packaging and scan them to get maximum benefit.
        </Typography>
      </CardContent>
    </Card>
    </Box>
  );
}
