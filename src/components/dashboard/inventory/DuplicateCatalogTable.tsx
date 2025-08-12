'use client';
import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  Button,
} from '@mui/material';

const duplicateCatalogs = [
  {
    id: '140136005',
    name: 'Classy Digital Pianos',
    category: 'Digital Pianos',
    image: '/images/piano.png',
    skus: [
      {
        name: 'Digital Piano Model X',
        style: 'Style ID: PianoX',
        sku: 'SKU: PianoX-001',
        price: '₹5000',
        variation: 'Standard',
        stock: 10,
        reason: 'This product duplicates an existing Meesho product ID1234567890',
        duplicateId: 'ID1234567890',
      },
    ],
  },
  {
    id: '138458243',
    name: 'Attractive Table Tennis Table Tennis Sets',
    category: 'Table Tennis Table Tennis Sets',
    image: '/images/ttset.png',
    skus: [
      {
        name: 'Table Tennis Self Training Indoor Gaming 2 Racket & 6 Practice Ball Portable',
        style: 'Style ID: Table Tennis Self Training Ind...',
        sku: 'SKU: Table Tennis Self Training Ind...',
        price: '₹300',
        variation: 'Free Size',
        stock: 100,
        reason: 'This product duplicates an existing Meesho product ID435387294',
        duplicateId: 'ID435387294',
      },
    ],
  },
  // Add more catalogs as needed
];

export default function DuplicateCatalogTable(): React.JSX.Element {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const selectedCatalog = duplicateCatalogs[selectedIdx];

  return (
    <Box sx={{ display: 'flex', height: 400, background: '#f9fafb', borderRadius: 2, overflow: 'hidden', boxShadow: 1 }}>
      {/* Left: Catalog List */}
      <Box sx={{ width: 260, borderRight: '1px solid #eee', bgcolor: '#fff', overflowY: 'auto' }}>
        <Typography sx={{ fontWeight: 700, fontSize: 15, p: 2, pb: 1, borderBottom: '1px solid #eee' }}>
          Catalog: Duplicate
        </Typography>
        <List dense>
          {duplicateCatalogs.map((cat, idx) => (
            <ListItemButton
              key={cat.id}
              selected={selectedIdx === idx}
              onClick={() => setSelectedIdx(idx)}
              sx={{
                alignItems: 'flex-start',
                bgcolor: selectedIdx === idx ? '#e0e7ff' : undefined,
                borderLeft: selectedIdx === idx ? '3px solid #6366f1' : '3px solid transparent',
                mb: 0.5,
                borderRadius: 1,
                textAlign: 'left',
                width: '100%',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <ListItemAvatar>
                <Avatar src={cat.image} variant="square" sx={{ width: 48, height: 48, mr: 1 }} />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography sx={{ fontWeight: 600, fontSize: 14 }}>{cat.name}</Typography>}
                secondary={
                  <Typography sx={{ fontSize: 12, color: '#666' }}>
                    Catalog ID: {cat.id}
                    <br />
                    Category: {cat.category}
                  </Typography>
                }
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Right: Catalog Details */}
      <Box sx={{ flex: 1, p: 2 }}>
        <Typography sx={{ fontWeight: 600, fontSize: 16 }}>
          {selectedCatalog.name}
        </Typography>
        <Typography sx={{ fontSize: 13, color: '#666', mb: 1 }}>
          Catalog ID: {selectedCatalog.id} | Category: {selectedCatalog.category}
        </Typography>
        <TableContainer component={Paper} sx={{ boxShadow: 0 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ background: '#f3f4f6' }}>
                <TableCell sx={{ fontWeight: 700 }}>SKU</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Variation</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Current Stock</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Reason</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedCatalog.skus.map((sku, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar src={selectedCatalog.image} variant="square" sx={{ width: 48, height: 48 }} />
                      <Box>
                        <Typography sx={{ fontWeight: 500, fontSize: 14 }}>{sku.name}</Typography>
                        <Typography sx={{ fontSize: 12, color: '#666' }}>{sku.style}</Typography>
                        <Typography sx={{ fontSize: 12, color: '#666' }}>{sku.sku}</Typography>
                        <Typography sx={{ fontSize: 12, color: '#666' }}>Meesho Price: {sku.price}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{sku.variation}</TableCell>
                  <TableCell>{sku.stock}</TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: 13 }}>
                      {sku.reason}{' '}
                      <Link href="#" underline="hover" sx={{ ml: 0.5 }}>
                        {sku.duplicateId}
                      </Link>
                      <br />
                      <Button variant="text" size="small" sx={{ p: 0, minWidth: 0, color: '#2563eb', fontWeight: 600 }}>
                        Report Issue
                      </Button>
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}