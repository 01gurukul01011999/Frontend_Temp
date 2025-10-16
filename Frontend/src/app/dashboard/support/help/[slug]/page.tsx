
'use client';
import React from 'react';
import { notFound, useRouter } from 'next/navigation';
import { Box, Typography, Card, CardContent, List, ListItem, ListItemText, ListItemButton, Breadcrumbs, Link as MuiLink } from '@mui/material';
import NextLink from 'next/link';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { helpMap as sharedHelpMap } from '../../../../../lib/help-form';


const helpData = sharedHelpMap;

export default function HelpCategoryPage(props: { params?: Promise<Record<string, string | undefined>> }) {
  // Unwrap params which may be a Promise in newer Next.js versions.
  // Use React.use(...) to unwrap the possibly-promise params object per Next.js guidance
  // and provide a typed fallback to satisfy TypeScript.
  const paramsObj = (React as unknown as { use: <T>(u: T | Promise<T>) => T }).use(
    props.params ?? ({} as { slug?: string })
  );
  const router = useRouter();
  const slug = paramsObj?.slug ?? '';
  const data = helpData[slug];
  if (!data) return notFound();

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
                          const g = globalThis as unknown as { location?: { origin?: string; href?: string } };
                          const origin = g.location?.origin ?? '';
                          if (g.location) {
                            g.location.href = `${origin}/dashboard/support/form/${formId}?${params.toString()}`;
                            return;
                          }
                          router.push(`/dashboard/support/form/${formId}?${params.toString()}`);
                        } catch {
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
              {groupedCategories
                .filter((cat) => cat.key !== slug)
                .map((cat) => (
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
