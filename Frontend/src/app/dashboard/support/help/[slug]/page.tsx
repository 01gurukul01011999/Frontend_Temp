
'use client';
import React, { useState } from 'react';
import { notFound } from 'next/navigation';
import { Box, Typography, Card, CardContent, List, ListItem, ListItemText, ListItemButton, Button, TextField, Breadcrumbs, Link as MuiLink } from '@mui/material';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import sharedHelpMap from '../../../../../../src/lib/helpForm';


const helpData = sharedHelpMap;

export default function HelpCategoryPage(props: any) {
  const { params } = props;
  // Next.js may pass params as a Promise; unwrap with React.use()
  const unwrappedParams = React.use(params) ?? {};
  const slug = (unwrappedParams as any)?.slug;
  const data = helpData[slug];
  if (!data) return notFound();
  const router = useRouter();

  // prepare grouped categories (dedupe by form_id)
  const groupedCategories = Object.entries(helpData).map(([key, val]) => {
    const seen = new Set<string>();
    const items = (val.items || []).filter((it) => {
      if (seen.has(it.form_id)) return false;
      seen.add(it.form_id);
      return true;
    });
    return { key, title: val.title, items };
  });

  return (
    <Box sx={{ display: 'flex', gap: 1, p: 3, backgroundColor: '#ffffff', ml: -3, mr: -3, mb: 3 }}>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h5" sx={{ mb: 0, }}>{data.title}</Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ ml: 0.5 , mb: 1, fontSize: '0.7rem' }} separator=">" >
          <MuiLink component={NextLink} href="/dashboard/support?support=help" underline="hover" color="inherit">Help</MuiLink>
          <Typography sx={{fontSize: '0.7rem'}} color="text.primary">{data.title}</Typography>
        </Breadcrumbs>
        <Card>
          <CardContent>
            <List>
              {data.items.map((it, idx) => (
                  <ListItem key={`${it.form_id}_${idx}`} disablePadding divider>
                    <ListItemButton
                      onClick={() => {
                        // navigate to the full-page form for this item
                        const formId = it.form_id;
                        const params = new URLSearchParams();
                        params.set('question', it.label);
                        // include the form id in the query so the URL contains form=form_id
                        params.set('form', formId);
                        // mark support=help so main support page will open Help tab when used
                        params.set('support', 'help');
                        try {
                          const origin = typeof window !== 'undefined' ? window.location.origin : '';
                          window.location.href = `${origin}/dashboard/support/form/${formId}?${params.toString()}`;
                        } catch (e) {
                          // fallback to router
                          router.push(`/dashboard/support/form/${formId}?${params.toString()}`);
                        }
                      }}
                      sx={{
                        px: 2,
                        '&:hover': { backgroundColor: 'rgba(25,118,210,0.06)' },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <ListItemText primary={it.label} />
                      <ArrowForwardIosIcon fontSize="small" sx={{ color: 'action.active' }} />
                    </ListItemButton>
                  </ListItem>
                ))}
            </List>
          </CardContent>
        </Card>

       
      </Box>


      <Box sx={{ width: 360, mt:4 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Find More Help</Typography>
        <Card>
          <CardContent sx={{ py: 1, px: 1 }}>
            <List sx={{ p: 0, m: 0 }}>
              {groupedCategories.map((cat) => (
                <ListItem key={cat.key} divider>
                  <NextLink href={`/dashboard/support/help/${cat.key}`} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                    <ListItemText primary={cat.title} primaryTypographyProps={{ sx: { fontWeight: 700 } }} />
                  </NextLink>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
