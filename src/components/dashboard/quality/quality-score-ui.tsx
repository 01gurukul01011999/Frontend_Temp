import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Tab,
  Tabs,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Image from "next/image";

export default function QualityScoreUI(): React.JSX.Element {
  return (
    <Box sx={{ p: 2, mr:-3, ml:-3, backgroundColor: '#ffff', mt:0.5  }}  >
      {/* Score & Feedback Section */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        mb={2}
      >
        {/* Quality Score */}
        <Card sx={{ flex: 1, borderRadius: 2 }}>
          <CardContent>
            <Typography fontWeight="bold" mb={1}>
              Quality Score{" "}
              <InfoOutlinedIcon fontSize="small" sx={{ verticalAlign: "middle" }} />
            </Typography>
            <Typography fontSize={13} color="text.secondary" mb={1}>
              1 and 2 star ratings <b>166</b> · Total Ratings <b>504</b> ·
              Quality Score = 166/504 = <b>32.9%</b>
            </Typography>

            {/* Segmented Progress Bar */}
      <Box sx={{ position: "relative", mb: 1 }}>
        <Box
          sx={{
            display: "flex",
            height: 20,
            borderRadius: 10,
            overflow: "hidden",
            width: "100%",
          }}
        >
          <Box sx={{ bgcolor: "#d4f5d1", flex: 15, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>
            1.6X VIEWS
          </Box>
          <Box sx={{ bgcolor: "#ffe08a", flex: 15, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>
            1X VIEWS
          </Box>
          <Box sx={{ bgcolor: "#fcbebe", flex: 15, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>
            0.6X VIEWS
          </Box>
          <Box sx={{ bgcolor: "#f8c6c6", flex: 15, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>
            NO VIEWS
          </Box>
        </Box>

        {/* Score Badge */}
        <Box
          sx={{
            position: "absolute",
            top: -32,
            left: "68%",
            transform: "translateX(-50%)",
            bgcolor: "#000",
            color: "#fff",
            px: 1.2,
            py: 0.5,
            fontWeight: "bold",
            fontSize: 12,
            borderRadius: 1,
            boxShadow: 2,
            "::after": {
              content: '""',
              position: "absolute",
              bottom: -6,
              left: "50%",
              transform: "translateX(-50%)",
              border: "6px solid transparent",
              borderTopColor: "#000",
            },
          }}
        >
          32.9% <span style={{ fontWeight: 400 }}>(Very Poor)</span>
        </Box>
      </Box>

      {/* Legend Below */}
      <Box display="flex" justifyContent="space-between">
        <Legend label="Green" range="0 - 15%" />
        <Legend label="Yellow" range="15 - 22%" />
        <Legend label="Red" range="22 - 25%" />
        <Legend label="Blocked" range="More than 25%" />
      </Box>

            {/* Note */}
            <Box
              sx={{
                bgcolor: "#fff1f0",
                color: "#cf1322",
                fontSize: 12,
                borderRadius: 1,
                p: 1,
              }}
            >
              Most of your products have been blocked since your score has exceeded 25%.
              Additionally, any new uploads will get blocked until your score reduces.
            </Box>
          </CardContent>
        </Card>

        {/* Top Customer Feedback */}
        <Card sx={{ flex: 1, borderRadius: 2 }}>
          <CardContent sx={{ textAlign: "center" }}>
            <Typography fontWeight="bold" mb={1}>
              Top Customer Feedback
            </Typography>
            <Box>
              <Typography fontSize={14} fontWeight="medium" mt={4}>
                📦 No feedback available
              </Typography>
              <Typography fontSize={13} color="text.secondary">
                Great work! Continue listing good quality products
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Stack>

      {/* Tabs + Sort */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Tabs value={0} textColor="primary">
          <Tab label="Action Pending (0)" />
          <Tab label="Fixed (0)" />
        </Tabs>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography fontSize={13} fontWeight="medium">
            Sort by:
          </Typography>
          <Select value="Relevance" size="small" sx={{ fontSize: 13 }}>
            <MenuItem value="Relevance">Relevance</MenuItem>
            <MenuItem value="Date">Date</MenuItem>
          </Select>
        </Stack>
      </Stack>

      {/* Table with empty state */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Details and Quality Score</TableCell>
              <TableCell>Top Customer Feedback</TableCell>
              <TableCell>Product Listing Improvements</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
        </Table>

        <Box textAlign="center" py={5}>
          <Image
            src="https://www.svgrepo.com/show/401832/box-empty.svg"
            alt="Empty"
            width={80}
            style={{ marginBottom: 8 }}
          />
          <Typography fontWeight="bold">No products as of now</Typography>
          <Typography fontSize={13} color="text.secondary">
            Products that have poor quality or listing issues will appear here.
          </Typography>
        </Box>
      </TableContainer>
    </Box>
  );
}

type LegendProps = {
  label: string;
  range: string;
};

function Legend({ label, range }: LegendProps) {
  return (
    <Box textAlign="center">
      <Typography fontSize={13} fontWeight="bold">
        {label}
      </Typography>
      <Typography fontSize={12} color="text.secondary">
        {range}
      </Typography>
    </Box>
  );
}
