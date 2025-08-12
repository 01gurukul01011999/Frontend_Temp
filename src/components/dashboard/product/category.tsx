import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import type { SxProps } from '@mui/material/styles';
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
  inactive: { label: 'inactive', color: 'warning' },
  active: { label: 'active', color: 'success' },
  
} as const;

export interface category {
  catId: string;
  title: string;
  slug: string;
  amount: number;
  sta : 'active' | 'inactive';
  datestamp: Date;
}

export interface categoryProps {
  category?: category[];
  sx?: SxProps;
  onDelete?: (catId: string) => void;
}

export function Category({ category = [], sx, onDelete }: categoryProps): React.JSX.Element {
  const [sortBy, setSortBy] = React.useState<'catId' | 'title' | 'slug' | 'sta' | 'datestamp'>('catId');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');

  const handleSort = (column: 'catId' | 'title' | 'slug' | 'sta' | 'datestamp') => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const sortedCategories = React.useMemo(() => {
    const sorted = [...category].sort((a, b) => {
      if (sortBy === 'datestamp') {
        const aTime = new Date(a.datestamp).getTime();
        const bTime = new Date(b.datestamp).getTime();
        if (aTime < bTime) return sortOrder === 'asc' ? -1 : 1;
        if (aTime > bTime) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      }
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [category, sortBy, sortOrder]);

  return (
    <Card sx={sx}>
      <CardHeader title="Categories" />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell onClick={() => handleSort('catId')} sx={{ cursor: 'pointer' }}>
                Id {sortBy === 'catId' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </TableCell>
              <TableCell onClick={() => handleSort('title')} sx={{ cursor: 'pointer' }}>
                Category Name {sortBy === 'title' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </TableCell>
              <TableCell onClick={() => handleSort('slug')} sx={{ cursor: 'pointer' }}>
                Slug {sortBy === 'slug' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </TableCell>
              <TableCell onClick={() => handleSort('sta')} sx={{ cursor: 'pointer' }}>
                Status {sortBy === 'sta' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </TableCell>
              <TableCell onClick={() => handleSort('datestamp')} sx={{ cursor: 'pointer' }} sortDirection={sortBy === 'datestamp' ? sortOrder : false}>
                Date {sortBy === 'datestamp' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedCategories.map((category) => {
              const { label, color } = statusMap[category.sta] ?? { label: 'Unknown', color: 'default' };
              return (
                <TableRow hover key={category.catId}>
                  <TableCell>{category.catId}</TableCell>
                  <TableCell>{category.title}</TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell>
                    <Chip color={color} label={label} size="small" />
                  </TableCell>
                  <TableCell>{
                    dayjs().diff(dayjs(category.datestamp), 'minute') < 60
                      ? dayjs(category.datestamp).fromNow()
                      : dayjs().diff(dayjs(category.datestamp), 'hour') < 24
                        ? dayjs(category.datestamp).fromNow()
                        : dayjs(category.datestamp).format('MMM D, YYYY')
                  }</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      component={Link}
                      href={`/dashboard/product/categories/edit?edit=${category.catId}`}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => onDelete?.(category.catId)}>
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
