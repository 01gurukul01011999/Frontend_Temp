import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

const warehouseFeesData = [
  {
    charge: 'Delivered Orders (Local Zones < 500km from Warehouse)',
    values: ['₹4', '₹10', '₹13.50', '₹28', '₹38']
  },
  {
    charge: 'Delivered Orders (National Zones > 500km from Warehouse)',
    values: ['₹15', '₹20', '₹27', '₹40', '₹67']
  },
  {
    charge: 'Return Orders',
    values: ['₹12.75', '₹14', '₹14.75', '₹20.50', '₹20.50']
  },
  {
    charge: 'Charges for SKUs with inventory unsold for over 30 days',
    values: ['₹7.50', '₹17', '₹21', '₹50', '₹104']
  },
  {
    charge: 'B2B reject fee',
    values: ['₹4', '₹11', '₹17', '₹30', '₹66']
  },
  {
    charge: 'RTO processing fee / Storage fee / Insurance charges',
    values: ['FREE', 'FREE', 'FREE', 'FREE', 'FREE']
  }
];

const reverseShippingData = [
  {
    courier: 'valmo',
    values: ['₹153/₹145', '₹163/₹157', '₹181/₹168', '₹186/₹176', '₹202/₹194']
  },
  {
    courier: 'xpressbees',
    values: ['₹155/₹147', '₹165/₹157', '₹171/₹161', '₹178/₹168', '₹204/₹196']
  },
  {
    courier: 'shadowfax',
    values: ['₹162/₹154', '₹172/₹164', '₹180/₹170', '₹192/₹182', '₹210/₹200']
  },
  {
    courier: 'delhivery',
    values: ['₹168/₹161', '₹178/₹170', '₹185/₹175', '₹200/₹190', '₹219/₹209']
  },
  {
    courier: 'ecom',
    values: ['₹165/₹157', '₹175/₹167', '₹181/₹173', '₹188/₹180', '₹215/₹207']
  }
];
const oneTimeCharges = [
  { description: 'GST + APOB', charge: '₹9999 + GST' },
  { description: 'VPOB Renewal', charge: '₹8000 + GST' },
  { description: 'Only APOB', charge: '₹500 + GST' }
];
type CustomTableProps = {
  title: string;
  headers: string[];
  rows: { charge?: string; courier?: string; values: string[] }[];
};

const CustomTable: React.FC<CustomTableProps> = ({ title, headers, rows }) => (
  <Box my={4}>
    <Typography variant="h6" align="center" gutterBottom>{title}</Typography>
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell><strong>{headers[0]}</strong></TableCell>
            {headers.slice(1).map((h, idx) => (
              <TableCell key={idx} align="center"><strong>{h}</strong></TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell>{row.charge || row.courier}</TableCell>
              {row.values.map((val, i) => (
                <TableCell key={i} align="center">{val}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

export default function ShippingFees() {
  return (
    <Box p={2} sx={{ backgroundColor: '#ffff',  mt: 1, ml: -3, mr: -3 }}>
      <CustomTable
        title="Warehouse Fees"
        headers={[
          'Per Unit Charges',
          'Up to 150 gms',
          '151-500 gms',
          '501-1000 gms',
          '1001-2000 gms',
          'Above 2000 gms'
        ]}
        rows={warehouseFeesData}
      />

      <CustomTable
        title="Reverse Shipping Fees"
        headers={[
          'Courier Partner',
          'Up to 500 gms',
          '501-1000 gms',
          '1001-1500 gms',
          '1501-2000 gms',
          '2001-2500 gms'
        ]}
        rows={reverseShippingData}
      />
   <Typography variant="h6" align="center" gutterBottom>
      One Time Charges per Warehouse Location
    </Typography>

    <TableContainer component={Paper} sx={{ maxWidth: 600, margin: '0 auto' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell><strong>One Time Charges (Per Warehouse Location)</strong></TableCell>
            <TableCell align="center"><strong>Charge</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {oneTimeCharges.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.description}</TableCell>
              <TableCell align="center">{item.charge}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>



    </Box>
  );
}
