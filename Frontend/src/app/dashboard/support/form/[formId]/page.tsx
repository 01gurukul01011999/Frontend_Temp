"use client";
import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Typography, Card, CardContent, List, ListItem, ListItemText, ListItemButton, Breadcrumbs, Link as MuiLink, Button, Divider, Stack } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import NextLink from 'next/link';
import { helpMap } from '../../../../../lib/help-form';

type SupportFormProps = { params?: { formId?: string } };

export default function SupportFormPage(props: SupportFormProps) {
  const { params } = props;
  // Next.js may pass params as a Promise; unwrap using React.use(...) shim
  const unwrappedParams = (React as unknown as { use: <T>(u: T | Promise<T>) => T }).use(
    params ?? ({} as { formId?: string })
  );
  const formId = unwrappedParams.formId as string | undefined;
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
  //console.log(helpMapBrief);
  //console.log(categoryKey);

  const category = helpMapBrief[categoryKey] ?? { title: 'Help', items: [] };

  // Remove the currently shown question and deduplicate items by label (keep first occurrence)
  // (kept as local computation in case it's needed later)
  const _relatedItems = (() => {
  const raw = category.items.filter((i) => (i.label === question ? false : true));
    const map = new Map<string, typeof raw[number]>();
    for (const it of raw) {
      const key = String(it.label ?? '').trim();
      if (map.has(key)) continue;
      map.set(key, it);
    }
    return [...map.values()];
  })();

  // the currently selected item (may include description, images, guide)
  const currentItem = category.items.find((i) => i.form_id === effectiveFormId);
console.log(currentItem);
  const handleRaiseTicket = () => {
    const params = new URLSearchParams();
    params.set('support', 'tickets');
    if (effectiveFormId) params.set('form', effectiveFormId);
    if (question) params.set('question', question);

    // Safely attempt a full-page redirect using the global location if available.
    // Use a conservative unknown-cast to avoid `any` and satisfy the linter.
    let origin = '';
    try {
      const g = globalThis as unknown as { location?: { origin?: string } };
      origin = g.location?.origin ?? '';
    } catch {
      origin = '';
    }

    try {
      const g = globalThis as unknown as { location?: { href?: string } };
      if (g.location) {
        g.location.href = `${origin}/dashboard/support?${params.toString()}`;
        return;
      }
      throw new Error('no-location');
    } catch {
      // fall back to client-side navigation when a global location isn't available
      router.push(`/dashboard/support?${params.toString()}`);
    }
  };
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);
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
              <Typography
                variant="body1"
                sx={{ color: 'text.secondary' }}
                dangerouslySetInnerHTML={{ __html: String(currentItem.description) }}
              />
            </Box>
          )}

         

          {currentItem?.guide && currentItem.guide.length > 0 && (
            <Box sx={{ mt: 1, }}>
              <Typography variant="subtitle1" sx={{ mb: 1 , fontWeight: 700, mt: 2, fontStyle: 'italic'  }}>Video guidelines (To be strictly followed for correct claims resolution):</Typography>
              <Box
                component="ol"
                sx={{
                  pl: 3,
                  m: 0,
                  listStyleType: 'decimal',
                  '& > li': { mb: 0 },
                }}
              >
                {currentItem.guide.map((step, idx) => (
                  <Box component="li" key={idx} sx={{ listStylePosition: 'outside' }}>
                    <Typography variant="body2">{step}</Typography>
                  </Box>
                ))}
                {currentItem?.images && currentItem.images.length > 0 && (
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1, mt: 2 }}>
                    <Typography variant='body2'>Please refer the below image.</Typography>
                    {currentItem.images.map((src) => (
                      <Box component="img" key={src} src={src} alt={currentItem.label} sx={{ width: '40%', borderRadius: 1 }} />
                    ))}
                  </Box>
                )}
                 <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 1, mt: 3, maxWidth:400 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Was this information helpful?</Typography>
            <Stack direction="row" spacing={1} >
              <Button
                size="small"
                variant={feedback === 'yes' ? 'contained' : 'outlined'}
                startIcon={<ThumbUpIcon />}
                onClick={() => setFeedback('yes')}
                sx={{ borderRadius: '999px', textTransform: 'none', px: 2 }}
              >
                Yes
              </Button>
              <Button
                size="small"
                variant={feedback === 'no' ? 'contained' : 'outlined'}
                startIcon={<ThumbDownIcon />}
                onClick={() => setFeedback('no')}
                sx={{ borderRadius: '999px', textTransform: 'none', px: 2 }}
              >
                No
              </Button>
            </Stack>
          </Box>
               <Divider sx={{ my: 2 }} />
               <Typography variant="body2" sx={{ fontWeight: 600 }}>Having this issue?</Typography>
                {/* Raise a Ticket button below the guide */}
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, maxWidth:400 }}>
                  
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleRaiseTicket}
                    sx={{ textTransform: 'none', fontWeight: 700 }}
                  >
                    Raise a Ticket
                  </Button>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>  Expect response in 7 days</Typography>
                  
                
                </Box>
              </Box>
            </Box>
          )}

        </Box>

         

        <Box sx={{ width: 360 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Find More Help</Typography>
          <Card>
            <CardContent sx={{ py: 1, px: 1 }}>
              <List sx={{ p: 0, m: 0 }}>
                {/* Show only items from the current category (exclude the currently displayed form) */}
                {(() => {
                  const currentCategory = helpMapBrief[categoryKey] ?? { title: 'Help', items: [] };
                  const q = String(question ?? '').trim();
                  const itemsToShow = currentCategory.items.filter((it) => {
                    const label = String(it.label ?? '').trim();
                    if (effectiveFormId && it.form_id === effectiveFormId) return false;
                    if (q && label && label === q) return false;
                    return true;
                  });
                  return (
                    <Box key={categoryKey} sx={{ width: '100%' }}>
                      <ListItem disablePadding sx={{ px: 0 }}>
                        <ListItemText
                          primary={currentCategory.title}
                          primaryTypographyProps={{ sx: { fontSize: '0.8rem', fontWeight: 700 } }}
                        />
                      </ListItem>

                      <List sx={{ p: 0, m: 0 }}>
                        {itemsToShow.map((it, idx) => (
                          <ListItem key={`${categoryKey}_${it.form_id}_${idx}`} disablePadding divider>
                            <ListItemButton
                              onClick={() => {
                                const formId = it.form_id;
                                const params = new URLSearchParams();
                                params.set('question', it.label);
                                params.set('form', formId);
                                params.set('support', 'help');
                                try {
                                  let origin = '';
                                  try {
                                    const g = globalThis as unknown as { location?: { origin?: string } };
                                    origin = g.location?.origin ?? '';
                                  } catch {
                                    origin = '';
                                  }
                                  const g = globalThis as unknown as { location?: { href?: string } };
                                  if (g.location) {
                                    g.location.href = `${origin}/dashboard/support/form/${formId}?${params.toString()}`;
                                    return;
                                  }
                                  router.push(`/dashboard/support/form/${formId}?${params.toString()}`);
                                } catch {
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
                    </Box>
                  );
                })()}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
