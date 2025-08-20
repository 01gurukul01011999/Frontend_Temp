'use client';
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Divider,
  IconButton,
  Chip,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Dot } from 'recharts';

export default function PaymentDashboard(): React.JSX.Element {

    // Dummy chart data for demonstration
    const chartData = [
      { date: '01 Jul', payments: 15 },
      { date: '02 Jul', payments: 10 },
      { date: '03 Jul', payments: 0 },
      { date: '04 Jul', payments: 0 },
      { date: '05 Jul', payments: 0 },
      { date: '06 Jul', payments: 0 },
      { date: '07 Jul', payments: 0 },
    ];

  return (
    <Box p={2}  sx={{ml:-3, mr:-3 }}>
      {/* Top Summary Cards */}
      <Stack direction="row" spacing={2} mb={3} flexWrap="wrap">
      {/* Payments to Date Card */}
      <Card sx={{ minWidth: 300, flex: 1, p: 2 }}>
        <CardContent sx={{ p: 0 }}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={0.5}>
              <Typography variant="body2" fontWeight={500}>
                Payments to Date
              </Typography>
              <Tooltip title="Total payment till date">
                <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              </Tooltip>
            </Box>
            <Button variant="outlined" size="small" sx={{ fontWeight: 600, textTransform: 'none' }}>
              View Details
            </Button>
          </Box>

          {/* Amount */}
          <Typography variant="h4" fontWeight="bold" mt={1}>
            ₹1,396,496
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Bottom Row */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2">
                Last Payment: <strong>₹3,927</strong>
              </Typography>
              <Chip
                label={
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <ThumbUpAltOutlinedIcon sx={{ fontSize: 16 }} />
                    Paid on 3 Dec
                  </Box>
                }
                size="small"
                sx={{
                  bgcolor: '#e6f4ea',
                  color: '#137333',
                  borderRadius: '8px',
                  fontSize: '12px',
                  px: 1,
                }}
              />
            </Stack>
            <IconButton size="small">
              <ArrowForwardIosIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      {/* Outstanding Payment Card */}
      <Card sx={{ minWidth: 300, flex: 1, p: 2 }}>
        <CardContent sx={{ p: 0 }}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={0.5}>
              <Typography variant="body2" fontWeight={500}>
                Total Outstanding Payment
              </Typography>
              <Tooltip title="Amount that is due">
                <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              </Tooltip>
            </Box>
            <Button variant="outlined" size="small" sx={{ fontWeight: 600, textTransform: 'none' }}>
              View Details
            </Button>
          </Box>

          {/* Amount */}
          <Typography variant="h4" fontWeight="bold" mt={1}>
            – ₹665
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Bottom Row */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2">
              Next Payment: – ₹665 <strong>on 28 Jul</strong>
            </Typography>
            <IconButton size="small">
              <ArrowForwardIosIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </Stack>

    {chartData.every((d) => d.payments === 1) ? (
  <Box
    sx={{
      textAlign: 'center',
      color: '#999',
      height: 250,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid #e0e0e0',
      borderRadius: 2,
      background: '#fafafa',
      mt: 2,
    }}
  >
    <Box
      component="img"
      src="https://www.svgrepo.com/show/327388/no-data.svg"
      alt="No trend"
      sx={{ width: 60, mb: 1, opacity: 0.5 }}
    />
    <Typography variant="subtitle2" fontWeight="bold">
      No Trend to Show
    </Typography>
    <Typography variant="body2">
      There is no sufficient data to show the results in the selected timeframe.
    </Typography>
  </Box>
) : (
     <Box
    sx={{
      textAlign: 'center',
     
    
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid #e0e0e0',
      borderRadius: 2,
      background: '#ffff',
        padding: 5,
      mt: 2,
    }}
  >
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={chartData}>
      <XAxis dataKey="date" />
      <YAxis />
      <Line
        type="monotone"
        dataKey="payments"
        stroke="#4a90e2"
        dot={(props) => (
          <Dot
            {...props}
            // onMouseEnter and onMouseLeave handlers removed to match expected signature
            r={5}
            fill="#4a90e2"
          />
        )}
      />
    </LineChart>
  </ResponsiveContainer>
  </Box>
)}

      {/* Note */}
      <Typography
        variant="caption"
        color="text.secondary"
        textAlign="center"
        display="block"
        mt={1}
      >
        The graph shows daily view of your 30 days payments
      </Typography>
    

      {/* Bottom Sections */}
      <Stack direction="row" spacing={2} flexWrap="wrap">
  {/* Compensation & Recoveries */}
<Card sx={{ flex: 1, minWidth: 300, borderRadius: 2, boxShadow: 0, bgcolor: "#f9fafe", p: 2 }}>
  <CardContent sx={{ p: 0 }}>
    {/* Header */}
    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
      <Typography fontWeight="bold" fontSize={14}>
        Compensation & Recoveries
      </Typography>
      <Typography fontSize={13} color="primary" sx={{ cursor: "pointer" }}>
        View Details
      </Typography>
    </Stack>

    {/* Subtitle */}
    <Typography fontSize={13} color="text.secondary" mb={2}>
      No data to show
    </Typography>

    {/* Compensations */}
    <Stack spacing={0.5} mb={1}>
      <Stack direction="row" justifyContent="space-between">
        <Typography fontSize={13}>Compensations</Typography>
        <Typography fontSize={13}>₹40</Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={40}
        sx={{
          height: 8,
          borderRadius: 1,
          backgroundColor: "#f1f5f9",
          "& .MuiLinearProgress-bar": {
            backgroundColor: "#d6e0f5", // light muted blue
          },
        }}
      />
    </Stack>

    {/* Recoveries */}
    <Stack spacing={0.5} mb={1}>
      <Stack direction="row" justifyContent="space-between">
        <Typography fontSize={13}>Recoveries</Typography>
        <Typography fontSize={13}>₹15</Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={15}
        sx={{
          height: 8,
          borderRadius: 1,
          backgroundColor: "#f1f5f9",
          "& .MuiLinearProgress-bar": {
            backgroundColor: "#d6e0f5",
          },
        }}
      />
    </Stack>

    {/* Total */}
    <Divider sx={{ my: 1 }} />
    <Stack direction="row" justifyContent="space-between">
      <Typography fontSize={13} fontWeight="bold">
        Total
      </Typography>
      <Typography fontSize={13} fontWeight="bold">
        ₹0
      </Typography>
    </Stack>
  </CardContent>
</Card>

  {/* Ads Cost */}
  <Card sx={{ flex: 1, minWidth: 300, borderRadius: 2, boxShadow: 0, bgcolor: "#f9fafe", p: 2 }}>
    <CardContent sx={{ p: 0 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography fontWeight="bold" fontSize={14}>
          Ads Cost
        </Typography>
        <Typography fontSize={13} color="primary" sx={{ cursor: "pointer" }}>
          View Details
        </Typography>
      </Stack>
      <Typography fontSize={13} color="text.secondary" mb={2}>
        You have not spent on Ads in the last 30 days.
      </Typography>
      <Box textAlign="center" mb={2}>
       <svg
    width={62}
    height={53}
    viewBox="0 0 64 55"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="css-0"
  >
    <path
      d="M40.816 21.508c1.57 4.482 8.888 2.742 11.218 9.099 2.33 6.356.712 12.63-13.752 16.325-14.464 3.695-29.505-3.359-32.267-12.9-2.76-9.54 3.748-19.807 13.29-22.568 9.54-2.761 18.21.616 21.511 10.044z"
      fill="#E5EEF9"
    />
    <circle cx="11.122" cy="39.653" r="6.013" fill="#F6C84F" />
    <circle cx="11.123" cy="39.653" r="4.656" fill="#DBA926" />
    <g filter="url(#filter0_i_5206_20193)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.076 37.29a.369.369 0 01.372-.364l3.404.037a.369.369 0 11-.008.737l-.881-.01c-.092 0-.148.106-.103.186.083.15.145.311.184.477.013.053.058.09.112.091l.68.008a.369.369 0 01-.008.737l-.682-.007a.117.117 0 00-.113.087 1.826 1.826 0 01-.49.822 1.907 1.907 0 01-.696.454c-.094.033-.12.166-.038.222l1.347.932a.369.369 0 11-.42.606l-2.5-1.729a.369.369 0 01.214-.672l.736.008c.388.005.616-.127.841-.348a1.14 1.14 0 00.192-.246c.04-.067-.013-.146-.092-.147l-1.362-.015a.369.369 0 11.008-.737l1.373.015c.076 0 .131-.075.098-.144a1.08 1.08 0 00-.2-.286c-.19-.194-.552-.33-.868-.333l-.736-.008a.369.369 0 01-.364-.372z"
        fill="url(#paint0_linear_5206_20193)"
      />
    </g>
    <circle cx="28.196" cy="34.997" r="6.013" fill="#F6C84F" />
    <circle cx="28.197" cy="34.997" r="4.656" fill="#DBA926" />
    <g filter="url(#filter1_i_5206_20193)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M26.15 32.634a.369.369 0 01.373-.364l3.403.036a.369.369 0 01-.008.738l-.88-.01c-.093 0-.149.105-.104.186.083.15.145.311.185.477.012.052.057.09.11.091l.68.008a.369.369 0 01-.007.737l-.682-.007a.116.116 0 00-.113.087 1.825 1.825 0 01-.49.822 1.906 1.906 0 01-.696.454c-.094.033-.12.165-.038.222l1.347.932a.369.369 0 01-.42.606l-2.5-1.729a.369.369 0 01.214-.672l.736.008c.388.004.616-.127.842-.348a1.14 1.14 0 00.192-.246c.038-.068-.014-.147-.093-.147L26.84 34.5a.369.369 0 01.008-.738l1.373.015c.077.001.131-.074.098-.143a1.075 1.075 0 00-.2-.286c-.19-.195-.552-.33-.867-.333l-.736-.008a.369.369 0 01-.365-.373z"
        fill="url(#paint1_linear_5206_20193)"
      />
    </g>
    <circle cx="45.27" cy="27.918" r="6.013" fill="#F6C84F" />
    <circle cx="45.271" cy="27.918" r="4.656" fill="#DBA926" />
    <g filter="url(#filter2_i_5206_20193)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M43.224 25.555a.369.369 0 01.373-.364l3.403.036a.369.369 0 01-.008.738l-.88-.01c-.093 0-.149.105-.104.186.083.15.145.311.185.477.012.052.058.09.111.091l.68.008a.369.369 0 11-.008.737l-.682-.008a.119.119 0 00-.113.088 1.825 1.825 0 01-.49.822 1.906 1.906 0 01-.696.453c-.093.034-.12.166-.038.223l1.347.931a.369.369 0 01-.42.607l-2.5-1.729a.369.369 0 01.214-.672l.736.008c.388.004.617-.128.842-.348a1.14 1.14 0 00.192-.246c.039-.068-.014-.147-.092-.147l-1.363-.015a.369.369 0 01.008-.738l1.373.015c.077.001.131-.074.098-.143a1.08 1.08 0 00-.2-.286c-.19-.195-.552-.33-.867-.333l-.736-.008a.369.369 0 01-.365-.373z"
        fill="url(#paint2_linear_5206_20193)"
      />
    </g>
    <path
      d="M2.873 29.17L24.77 16.466l1.947 6.855 16.802-10.662"
      stroke="#56BC87"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M51.669 8.597a1.758 1.758 0 00-1.47-2.117L41.71 5.27c-1.52-.218-2.567 1.48-1.692 2.742l6.653 9.587c.875 1.261 2.832.874 3.161-.626l1.837-8.376z"
      fill="#56BC87"
    />
    <g filter="url(#filter3_i_5206_20193)">
      <rect
        x="5.109"
        y="45.666"
        width="12.025"
        height="2.36"
        rx={1}
        fill="#F6C84F"
      />
    </g>
    <g filter="url(#filter4_i_5206_20193)">
      <rect
        x="22.184"
        y="45.666"
        width="12.025"
        height="2.36"
        rx={1}
        fill="#F6C84F"
      />
    </g>
    <g filter="url(#filter5_i_5206_20193)">
      <rect
        x="39.258"
        y="38.587"
        width="12.025"
        height="2.36"
        rx={1}
        fill="#F6C84F"
      />
    </g>
    <g filter="url(#filter6_i_5206_20193)">
      <rect
        x="39.258"
        y="40.946"
        width="12.025"
        height="2.36"
        rx={1}
        fill="#F6C84F"
      />
    </g>
    <g filter="url(#filter7_i_5206_20193)">
      <rect
        x="39.258"
        y="43.306"
        width="12.025"
        height="2.36"
        rx={1}
        fill="#F6C84F"
      />
    </g>
    <g filter="url(#filter8_i_5206_20193)">
      <rect
        x="39.258"
        y="45.666"
        width="12.025"
        height="2.36"
        rx={1}
        fill="#F6C84F"
      />
    </g>
    <g filter="url(#filter9_i_5206_20193)">
      <rect
        x="22.184"
        y="43.306"
        width="12.025"
        height="2.36"
        rx={1}
        fill="#F6C84F"
      />
    </g>
    <g filter="url(#filter10_i_5206_20193)">
      <rect
        x="22.184"
        y="43.306"
        width="12.025"
        height="2.36"
        rx={1}
        fill="#F6C84F"
      />
    </g>
    <g filter="url(#filter11_i_5206_20193)">
      <rect
        x="39.258"
        y="36.227"
        width="12.025"
        height="2.36"
        rx={1}
        fill="#F6C84F"
      />
    </g>
    <g filter="url(#filter12_i_5206_20193)">
      <rect
        x="22.184"
        y="40.946"
        width="12.025"
        height="2.36"
        rx={1}
        fill="#F6C84F"
      />
    </g>
    <g filter="url(#filter13_i_5206_20193)">
      <rect
        x="39.258"
        y="33.867"
        width="12.025"
        height="2.36"
        rx={1}
        fill="#F6C84F"
      />
    </g>
    <path
      d="M6.322 9.618a.161.161 0 01.288 0 5.154 5.154 0 002.317 2.317.16.16 0 010 .288A5.154 5.154 0 006.61 14.54a.16.16 0 01-.288 0 5.154 5.154 0 00-2.318-2.317.161.161 0 010-.288 5.154 5.154 0 002.318-2.317zM59.35 16.12a.224.224 0 01.4 0 7.162 7.162 0 003.22 3.22.224.224 0 010 .401 7.163 7.163 0 00-3.22 3.22.224.224 0 01-.4 0 7.163 7.163 0 00-3.22-3.22.224.224 0 010-.4 7.163 7.163 0 003.22-3.22z"
      fill="#F6C84F"
    />
    <defs>
      <filter
        id="filter0_i_5206_20193"
        x="9.076"
        y="36.926"
        width="4.141"
        height="5.57"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix
          in="SourceAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy=".125" />
        <feGaussianBlur stdDeviation=".062" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
        <feColorMatrix values="0 0 0 0 0.583333 0 0 0 0 0.415139 0 0 0 0 0.162847 0 0 0 1 0" />
        <feBlend in2="shape" result="effect1_innerShadow_5206_20193" />
      </filter>
      <filter
        id="filter1_i_5206_20193"
        x="26.15"
        y="32.27"
        width="4.141"
        height="5.57"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix
          in="SourceAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy=".125" />
        <feGaussianBlur stdDeviation=".062" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
        <feColorMatrix values="0 0 0 0 0.583333 0 0 0 0 0.415139 0 0 0 0 0.162847 0 0 0 1 0" />
        <feBlend in2="shape" result="effect1_innerShadow_5206_20193" />
      </filter>
      <filter
        id="filter2_i_5206_20193"
        x="43.224"
        y="25.19"
        width="4.141"
        height="5.57"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix
          in="SourceAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy=".125" />
        <feGaussianBlur stdDeviation=".062" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
        <feColorMatrix values="0 0 0 0 0.583333 0 0 0 0 0.415139 0 0 0 0 0.162847 0 0 0 1 0" />
        <feBlend in2="shape" result="effect1_innerShadow_5206_20193" />
      </filter>
      <filter
        id="filter3_i_5206_20193"
        x="5.109"
        y="45.666"
        width="12.025"
        height="2.359"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix
          in="SourceAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="-.44" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
        <feColorMatrix values="0 0 0 0 0.858824 0 0 0 0 0.662745 0 0 0 0 0.14902 0 0 0 1 0" />
        <feBlend in2="shape" result="effect1_innerShadow_5206_20193" />
      </filter>
      <filter
        id="filter4_i_5206_20193"
        x="22.184"
        y="45.666"
        width="12.025"
        height="2.359"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix
          in="SourceAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="-.44" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
        <feColorMatrix values="0 0 0 0 0.858824 0 0 0 0 0.662745 0 0 0 0 0.14902 0 0 0 1 0" />
        <feBlend in2="shape" result="effect1_innerShadow_5206_20193" />
      </filter>
      <filter
        id="filter5_i_5206_20193"
        x="39.258"
        y="38.587"
        width="12.025"
        height="2.359"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix
          in="SourceAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="-.44" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
        <feColorMatrix values="0 0 0 0 0.858824 0 0 0 0 0.662745 0 0 0 0 0.14902 0 0 0 1 0" />
        <feBlend in2="shape" result="effect1_innerShadow_5206_20193" />
      </filter>
      <filter
        id="filter6_i_5206_20193"
        x="39.258"
        y="40.946"
        width="12.025"
        height="2.359"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix
          in="SourceAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="-.44" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
        <feColorMatrix values="0 0 0 0 0.858824 0 0 0 0 0.662745 0 0 0 0 0.14902 0 0 0 1 0" />
        <feBlend in2="shape" result="effect1_innerShadow_5206_20193" />
      </filter>
      <filter
        id="filter7_i_5206_20193"
        x="39.258"
        y="43.306"
        width="12.025"
        height="2.359"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix
          in="SourceAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="-.44" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
        <feColorMatrix values="0 0 0 0 0.858824 0 0 0 0 0.662745 0 0 0 0 0.14902 0 0 0 1 0" />
        <feBlend in2="shape" result="effect1_innerShadow_5206_20193" />
      </filter>
      <filter
        id="filter8_i_5206_20193"
        x="39.258"
        y="45.666"
        width="12.025"
        height="2.359"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix
          in="SourceAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="-.44" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
        <feColorMatrix values="0 0 0 0 0.858824 0 0 0 0 0.662745 0 0 0 0 0.14902 0 0 0 1 0" />
        <feBlend in2="shape" result="effect1_innerShadow_5206_20193" />
      </filter>
      <filter
        id="filter9_i_5206_20193"
        x="22.184"
        y="43.306"
        width="12.025"
        height="2.359"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix
          in="SourceAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="-.44" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
        <feColorMatrix values="0 0 0 0 0.858824 0 0 0 0 0.662745 0 0 0 0 0.14902 0 0 0 1 0" />
        <feBlend in2="shape" result="effect1_innerShadow_5206_20193" />
      </filter>
      <filter
        id="filter10_i_5206_20193"
        x="22.184"
        y="43.306"
        width="12.025"
        height="2.359"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix
          in="SourceAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="-.44" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
        <feColorMatrix values="0 0 0 0 0.858824 0 0 0 0 0.662745 0 0 0 0 0.14902 0 0 0 1 0" />
        <feBlend in2="shape" result="effect1_innerShadow_5206_20193" />
      </filter>
      <filter
        id="filter11_i_5206_20193"
        x="39.258"
        y="36.227"
        width="12.025"
        height="2.359"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix
          in="SourceAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="-.44" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
        <feColorMatrix values="0 0 0 0 0.858824 0 0 0 0 0.662745 0 0 0 0 0.14902 0 0 0 1 0" />
        <feBlend in2="shape" result="effect1_innerShadow_5206_20193" />
      </filter>
      <filter
        id="filter12_i_5206_20193"
        x="22.184"
        y="40.946"
        width="12.025"
        height="2.359"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix
          in="SourceAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="-.44" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
        <feColorMatrix values="0 0 0 0 0.858824 0 0 0 0 0.662745 0 0 0 0 0.14902 0 0 0 1 0" />
        <feBlend in2="shape" result="effect1_innerShadow_5206_20193" />
      </filter>
      <filter
        id="filter13_i_5206_20193"
        x="39.258"
        y="33.867"
        width="12.025"
        height="2.359"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix
          in="SourceAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="-.44" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
        <feColorMatrix values="0 0 0 0 0.858824 0 0 0 0 0.662745 0 0 0 0 0.14902 0 0 0 1 0" />
        <feBlend in2="shape" result="effect1_innerShadow_5206_20193" />
      </filter>
      <linearGradient
        id="paint0_linear_5206_20193"
        x1="11.156"
        y1="36.358"
        x2="11.085"
        y2="42.948"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset=".307" stopColor="#fff" />
        <stop offset={1} stopColor="#FFEACB" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_5206_20193"
        x1="28.231"
        y1="31.702"
        x2="28.159"
        y2="38.292"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset=".307" stopColor="#fff" />
        <stop offset={1} stopColor="#FFEACB" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_5206_20193"
        x1="45.305"
        y1="24.623"
        x2="45.233"
        y2="31.213"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset=".307" stopColor="#fff" />
        <stop offset={1} stopColor="#FFEACB" />
      </linearGradient>
    </defs>
  </svg>
        <Typography fontSize={13} fontWeight="bold">
          Boost order growth using Ads
        </Typography>
        <Typography fontSize={12} color="text.secondary">
          More than 2 Lac sellers have run Ads to grow their business,{" "}
          <Box component="span" color="primary" fontWeight="bold" sx={{ cursor: "pointer" }}>
            Try Ads
          </Box>
        </Typography>
      </Box>
    </CardContent>
  </Card>

  {/* Other Links */}
  <Card sx={{ flex: 1, minWidth: 300, borderRadius: 2, boxShadow: 0, bgcolor: "#f9fafe", p: 2 }}>
    <CardContent sx={{ p: 0 }}>
      <Typography fontWeight="bold" fontSize={14} mb={2}>
        Other Links
      </Typography>
      <Stack spacing={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography fontSize={13}>Referral Payments</Typography>
            <Typography fontSize={12} color="text.secondary">
              No new referral payments in the last 30 days!
            </Typography>
          </Box>
          <Typography color="primary" fontWeight="bold" sx={{ cursor: "pointer" }}>
            &gt;
          </Typography>
        </Box>
        <Divider />
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography fontSize={13}>Have a query?</Typography>
            <Typography fontSize={12} color="text.secondary">
              Raise a ticket for your payment related matters
            </Typography>
          </Box>
          <Typography color="primary" fontWeight="bold" sx={{ cursor: "pointer" }}>
            &gt;
          </Typography>
        </Box>
      </Stack>
    </CardContent>
  </Card>
</Stack>
    </Box>
  );
}
