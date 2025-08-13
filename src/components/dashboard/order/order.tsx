import * as React from 'react';
import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
// import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import { SxProps } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Link from 'next/link';

const statusMap = {
  'On Hold': { label: 'On Hold', color: 'warning' },
  pending: { label: 'pending', color: 'info' },
  'Ready To Ship': { label: 'ready to ship', color: 'primary'  },
  Shipped: { label: 'shipped', color: 'success' },
  Cancelled: { label: 'cancelled', color: 'error' },
 
  
} as const;

export interface order {
  ordersId: string;
  descrip: string;
  skuId: string;
  amount: number;
  sta : 'On Hold' | 'pending' | 'Ready To Ship' | 'Shipped' | 'Cancelled' ;
  orderDate: Date;
  dispatchDate: string;
  slaStatus: string; // Add this line
  labelDownloaded?: boolean;
}

export interface orderProps {
  order?: order[];
  sx?: SxProps;
  onDelete?: (ordersId: string) => void;
}

export function Order({ order = [], sx, onDelete }: orderProps): React.JSX.Element {
  const [sortBy, setSortBy] = React.useState<'ordersId' | 'descrip' | 'skuId' | 'sta' | 'orderDate'>('ordersId');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');

  const handleSort = (column: 'ordersId' | 'descrip' | 'skuId' | 'sta' | 'orderDate') => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const sortedOrders = React.useMemo(() => {
    const sorted = [...order].sort((a, b) => {
      if (sortBy === 'orderDate') {
        const aTime = new Date(a.orderDate).getTime();
        const bTime = new Date(b.orderDate).getTime();
        if (aTime < bTime) return sortOrder === 'asc' ? -1 : 1;
        if (aTime > bTime) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      }
  const aValue = a[sortBy];
  const bValue = b[sortBy];
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [order, sortBy, sortOrder]);

  return (
    <Card sx={sx}>
      {/*<CardHeader title="Orders" />
      <Divider />*/}
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell onClick={() => handleSort('ordersId')} sx={{ cursor: 'pointer' }}>
                Order Id {sortBy === 'ordersId' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </TableCell>
              <TableCell onClick={() => handleSort('descrip')} sx={{ cursor: 'pointer' }}>
                Order Details {sortBy === 'descrip' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </TableCell>
              <TableCell onClick={() => handleSort('skuId')} sx={{ cursor: 'pointer' }}>
                SKU ID {sortBy === 'skuId' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </TableCell>
              <TableCell onClick={() => handleSort('sta')} sx={{ cursor: 'pointer' }}>
                Status {sortBy === 'sta' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </TableCell>
              <TableCell onClick={() => handleSort('orderDate')} sx={{ cursor: 'pointer' }} sortDirection={sortBy === 'orderDate' ? sortOrder : false}>
                Date {sortBy === 'orderDate' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedOrders.map((order) => {
              const { label, color } = statusMap[order.sta] ?? { label: 'Unknown', color: 'default' };
              //console.log('order', order);
              return (
                <TableRow hover key={order.ordersId}>
                  <TableCell>{order.ordersId}</TableCell>
                  <TableCell>{order.descrip}</TableCell>
                  <TableCell>{order.skuId}</TableCell>
                  <TableCell>
                    <Chip color={color} label={label} size="small" />
                  </TableCell>
                  <TableCell>{
                    dayjs().diff(dayjs(order.orderDate), 'minute') < 60
                      ? dayjs(order.orderDate).fromNow()
                      : dayjs().diff(dayjs(order.orderDate), 'hour') < 24
                        ? dayjs(order.orderDate).fromNow()
                        : dayjs(order.orderDate).format('MMM D, YYYY')
                  }</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      component={Link}
                      href={`/dashboard/product/categories/edit?edit=${order.ordersId}`}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => onDelete?.(order.ordersId)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
       
      </CardActions>
    </Card>
  );
}
