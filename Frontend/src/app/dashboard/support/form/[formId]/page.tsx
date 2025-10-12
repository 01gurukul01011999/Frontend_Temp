"use client";
import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Typography, Card, CardContent, List, ListItem, ListItemText, ListItemButton, Breadcrumbs, Link as MuiLink } from '@mui/material';
import NextLink from 'next/link';
import helpMap from '../../../../../../src/lib/helpForm';

export default function SupportFormPage(props: any) {
  const { params } = props;
  // Next.js may pass params as a Promise; unwrap with React.use()
  const unwrappedParams = React.use(params) ?? {};
  const formId = (unwrappedParams as any)?.formId;
  const searchParams = useSearchParams();
  const router = useRouter();

  const question = searchParams?.get('question') ?? '';
  // allow overriding/selecting form via ?form=... so links like
  // /dashboard/support/form/form_returns_0?question=...&form=form_returns_0 work
  const queryForm = searchParams?.get('form') ?? undefined;
  const effectiveFormId = queryForm ?? formId;

  // derive category key from effectiveFormId like 'form_returns_0'
  const parts = (effectiveFormId ?? '')?.split('_') ?? [];
  const categoryKey = parts.length >= 2 ? parts[1] : 'others';

  const helpMapBrief = helpMap;
  console.log(helpMapBrief);
  console.log(categoryKey);

  const category = helpMapBrief[categoryKey] ?? { title: 'Help', items: [] };

  // Remove the currently shown question and deduplicate items by label (keep first occurrence)
  const relatedItems = (() => {
    const raw = category.items.filter((i) => i.label !== question);
    const map = new Map<string, typeof raw[number]>();
    for (const it of raw) {
      const key = String(it.label ?? '').trim();
      if (!map.has(key)) map.set(key, it);
    }
    return Array.from(map.values());
  })();

  // the currently selected item (may include description, images, guide)
  const currentItem = category.items.find((i) => i.form_id === effectiveFormId);
console.log(currentItem);
  return (
    <Box sx={{ p: 3, backgroundColor: '#ffffff', ml: -3, mr: -3,  }}>
      <Typography variant="h5">Support</Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{  flex: 1 , }}>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2,fontSize: '0.7rem',  }} separator=">">
            <MuiLink component={NextLink} href="/dashboard/support?support=help" underline="hover" color="inherit" >Help</MuiLink>
            <MuiLink component={NextLink} href={`/dashboard/support/help/${categoryKey}`} underline="hover" color="inherit`">{category.title}</MuiLink>
            <Typography sx={{ fontSize: '0.7rem', }}color="text.primary">{question || 'Help'}</Typography>
          </Breadcrumbs>

          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>{question || 'Describe your issue'}</Typography>
          <Box sx={{display: 'flex', flexDirection: 'row', contentAlign: 'center', justifyContent: 'center' , gap: 3 }}>
         <Box sx={{ mb: 0 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, textAlign: 'center', fontWeight: 700 }}>English</Typography>
          <Box sx={{ mb: 2 }}>
            {(() => {
              const engSrc = currentItem?.youtube_eng?.[0] ?? 'https://www.youtube.com/embed/dQw4w9WgXcQ';
              return <Box component="iframe" src={engSrc} width="100%" height={180} sx={{ border: 0 }} />;
            })()}
          </Box>
          </Box>
<Box sx={{ mb: 0 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, textAlign: 'center', fontWeight: 700 }}>Hindi</Typography>
          <Box sx={{ mb: 2}}>
            {(() => {
              const hiSrc = currentItem?.youtube_hi?.[0] ?? 'https://www.youtube.com/embed/dQw4w9WgXcQ';
              return <Box component="iframe" src={hiSrc} width="100%" height={180} sx={{ border: 0 }} />;
            })()}
          </Box>
          </Box>
</Box>
          {/* Render optional description, images and guide if present on the selected form item */}
          {currentItem?.description && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">{currentItem.description}</Typography>
            </Box>
          )}

          {currentItem?.images && currentItem.images.length > 0 && (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1, }}>
              {currentItem.images.map((src) => (
                <Box component="img" key={src} src={src} alt={currentItem.label} sx={{ width: '40%', borderRadius: 1 }} />
              ))}
            </Box>
          )}

          {currentItem?.guide && currentItem.guide.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 , fontWeight: 700, mt: 2,  }}>Guide</Typography>
              <Box
                component="ol"
                sx={{
                  pl: 3,
                  m: 0,
                  listStyleType: 'decimal',
                  '& > li': { mb: 1 },
                }}
              >
                {currentItem.guide.map((step, idx) => (
                  <Box component="li" key={idx} sx={{ listStylePosition: 'outside' }}>
                    <Typography variant="body2">{step}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>

        <Box sx={{ width: 360 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Find More Help</Typography>
          <Card>
            <CardContent sx={{ py: 1, px: 1 }}>
              <List sx={{ p: 0, m: 0 }}>
                {Object.entries(helpMapBrief).map(([k, v]) => {
                  const isCurrentCategory = k === categoryKey;
                  return (
                    <Box key={k} sx={{ width: '100%' }}>
                      {/* only render the category title for non-current categories */}
                     

                      {isCurrentCategory && (
                        <List sx={{ p: 0, m: 0 }}>
                          {v.items.filter((it) => it.form_id !== effectiveFormId).map((it, idx) => (
                            <ListItem key={`${k}_${it.form_id}_${idx}`} disablePadding divider>
                              <ListItemButton
                                onClick={() => {
                                  const formId = it.form_id;
                                  const params = new URLSearchParams();
                                  params.set('question', it.label);
                                  params.set('form', formId);
                                  params.set('support', 'help');
                                  try {
                                    const origin = typeof window !== 'undefined' ? window.location.origin : '';
                                    window.location.href = `${origin}/dashboard/support/form/${formId}?${params.toString()}`;
                                  } catch (e) {
                                    router.push(`/dashboard/support/form/${formId}?${params.toString()}`);
                                  }
                                }}
                                sx={{ '&:hover': { backgroundColor: 'rgba(25,118,210,0.04)' }, p: '6px 8px' }}
                              >
                                <ListItemText primary={it.label} primaryTypographyProps={{ sx: { fontSize: '0.72rem', lineHeight: 1.25 } }} />
                              </ListItemButton>
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </Box>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
