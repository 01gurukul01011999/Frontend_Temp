"use client";
"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";

export default function NoticesUi() {
  const [reason, setReason] = useState("");

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        p: 1,
        bgcolor: "#f9f9f9",
        minHeight: "100vh",
        ml: -3,
        mr: -3,
      }}
    >
      {/* Left column: two stacked cards */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
        <Card sx={{ boxShadow: 3 }}>
          <CardHeader
            title={
              <Typography variant="h6" fontWeight="bold">
                URGENT: Check and Fix your MDS DISCOUNTS
              </Typography>
            }
            subheader="Oct 01 2025"
          />
          <CardContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Check and Fix your Discounts for Maha Diwali Sale
            </Typography>

            <ol style={{ paddingLeft: "20px", marginBottom: "16px" }}>
              <li>Click ‘Check Discounts’ in the ‘Promotions’ tab</li>
              <li>Review all prices and discounts</li>
              <li>
                Discount is incorrect? <b>EDIT</b> or <b>OPT-OUT</b> yourself
              </li>
              <li>Everything’s perfect? Just Approve!</li>
            </ol>

            <Typography color="error" fontWeight="bold" sx={{ mb: 1 }}>
              Be 100% sure before the discounts Go-Live
            </Typography>

            <Typography sx={{ mb: 1 }}>
              <b>Important:</b> The window will close at 5pm tomorrow!
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Once the window closes, you can still raise Support Ticket in case
              of any issues!
            </Typography>

            <Box
              component="img"
              src="/mbs-discount.png"
              alt="MBS Discounts Banner"
              sx={{
                width: "100%",
                borderRadius: 1,
                border: "1px solid #eee",
                mt: 2,
              }}
            />

            {/* bottom info block */}
            <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #eee" }}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
                Check and Fix your Discounts for Maha Diwali Sale
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Once the window closes, you can still raise Support Ticket in case of any issues!
              </Typography>
              <Box
                component="img"
                src="/mbs-discount.png"
                alt="MBS Discounts Banner"
                sx={{ width: "100%", borderRadius: 1, border: "1px solid #eee", mt: 1 }}
              />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ boxShadow: 3 }}>
          <CardHeader
            title={
              <Typography variant="h6" fontWeight="bold">
                Another Card Title
              </Typography>
            }
          />
          <CardContent>
            <Typography variant="body1">Content for the second card goes here.</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Right column: leave request */}
      <Card sx={{ width: 320, boxShadow: 3, height: "fit-content" }}>
        <CardHeader
          title={
            <Typography variant="h6" fontWeight="bold">
              Important
            </Typography>
          }
        />
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            This is to capture your leave request responses. Your response will
            help us to update our users on delay and subsequently help in
            managing your pick-ups through our logistic partners.
          </Typography>

          <TextField label="Start Date" type="date" fullWidth InputLabelProps={{ shrink: true }} />
          <TextField label="End Date" type="date" fullWidth InputLabelProps={{ shrink: true }} />

          <TextField
            select
            label="Reason for Opting Leave"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            fullWidth
          >
            <MenuItem value="unable_to_process_due_to_lockdown">Unable to Process Due to Lockdown</MenuItem>
            <MenuItem value="manpower_issue">Manpower Issue</MenuItem>
            <MenuItem value="limited_inventory_stock_issue">Limited Inventory / Stock Issue</MenuItem>
            <MenuItem value="production_issue">Production Issue</MenuItem>
            <MenuItem value="limited_packaging_materials_issue">Limited Packaging Materials Issue</MenuItem>
            <MenuItem value="personal">Personal Reasons</MenuItem>
            <MenuItem value="festive_holidays">Festive Holidays</MenuItem>
            <MenuItem value="staff_self_suffering_from_covid">Staff/Self Suffering from Covid</MenuItem>
            <MenuItem value="local_strike">Local Strike</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>

          <Button variant="contained" fullWidth>
            Request For Leave
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

      