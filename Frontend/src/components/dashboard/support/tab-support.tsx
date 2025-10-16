"use client";
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Card,
  CardContent,
  Typography,
  IconButton,
  Popover,
  RadioGroup,
  FormControlLabel,
  Radio,
  Link,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Pagination,
  InputAdornment,
  Chip,
} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { ArrowUDownLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowUDownLeft';
import { SquaresFourIcon } from '@phosphor-icons/react/dist/ssr/SquaresFour';
import { PackageIcon } from '@phosphor-icons/react/dist/ssr/Package';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import AdvSupport from './adv';
import { mockTickets } from '@/lib/mock-tickets';
import { helpMap } from '@/lib/help-form';

const getCategoryKeyFromText = (text: string) => {
  const t = text.toLowerCase();
  if (t.includes('return')) return 'returns';
  if (t.includes('catalog')) return 'cataloging';
  if (t.includes('order')) return 'orders';
  if (t.includes('payment')) return 'payments';
  if (t.includes('inventory')) return 'inventory';
  if (t.includes('account')) return 'account';
  if (t.includes('advert')) return 'advertisements';
  if (t.includes('instant')) return 'instantcash';
  return 'others';
};


export default function SupportTabs(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();

  // derive initial state from URL params
  const supportParam = searchParams?.get('support') || 'help';
  const subParam = searchParams?.get('sub') || 'all';

  const subKeyToIndex: Record<string, number> = { all: 0, needs: 1, inprogress: 2, closed: 3 };
  const indexToSubKey = ['all', 'needs', 'inprogress', 'closed'];

  const [tab, setTab] = React.useState(supportParam === 'my-tickets' || supportParam === 'tickets' ? 1 : 0);
  const [subTab, setSubTab] = React.useState(subKeyToIndex[subParam] ?? 0);
  const [createdFilterOption, setCreatedFilterOption] = React.useState<'all' | 'yesterday' | 'last2days' | 'last1week' | 'custom'>('all');
  const [createdCustomFrom, setCreatedCustomFrom] = React.useState<string>(''); // yyyy-mm-dd
  const [createdCustomTo, setCreatedCustomTo] = React.useState<string>('');
  const [createdAnchorEl, setCreatedAnchorEl] = React.useState<HTMLElement | null>(null);
  // categories: empty = all
  const [categories, setCategories] = React.useState<string[]>([]);
  const [categoryAnchorEl, setCategoryAnchorEl] = React.useState<HTMLElement | null>(null);
  const [tempCategories, setTempCategories] = React.useState<string[]>([]);
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [selectedTicketId, setSelectedTicketId] = React.useState<string | null>(null);
  // URL-driven help form state (when navigating from help/[slug] list)
  const [helpFormId, setHelpFormId] = React.useState<string | null>(null);
  const [helpQuestion, setHelpQuestion] = React.useState<string | null>(null);
  const [_helpFormText, setHelpFormText] = React.useState('');
  const [_helpFormSubmitted, setHelpFormSubmitted] = React.useState(false);

  const rowsPerPage = 10;

  const filtered = React.useMemo(() => {
    let rows = [...mockTickets];
    // subTab: 0=All,1=Needs Attention,2=In Progress,3=Closed
    if (subTab === 1) rows = rows.filter((r) => r.status === 'Needs Attention');
    if (subTab === 2) rows = rows.filter((r) => r.status === 'In Progress');
    if (subTab === 3) rows = rows.filter((r) => r.status === 'Closed');

    if (categories.length > 0) {
      // map category keys to simple keywords to match issue text
      const keywordMap: Record<string, string> = {
        returns: 'return',
        cataloging: 'catalog',
        orders: 'order',
        payments: 'payment',
        inventory: 'inventory',
        account: 'account',
        advertisements: 'advertisement',
        instantcash: 'instant cash',
        others: 'others',
        warehouse: 'warehouse',
      };

      rows = rows.filter((r) => {
        const text = r.issue.toLowerCase();
        return categories.some((c) => {
          const kw = keywordMap[c] ?? c;
          return text.includes(kw.toLowerCase());
        });
      });
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter((r) => r.id.includes(q) || r.issue.toLowerCase().includes(q));
    }

    // Apply Created Date filter
    try {
      const now = new Date();
      let from: Date | null = null;
      let to: Date | null = null;

      switch (createdFilterOption) {
        case 'yesterday': {
          const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          from = new Date(startOfToday);
          from.setDate(from.getDate() - 1);
          to = new Date(startOfToday);
          break;
        }
        case 'last2days': {
          const start = new Date(now);
          start.setHours(0, 0, 0, 0);
          start.setDate(start.getDate() - 2);
          from = start;
          to = now;
          break;
        }
        case 'last1week': {
          const start = new Date(now);
          start.setHours(0, 0, 0, 0);
          start.setDate(start.getDate() - 7);
          from = start;
          to = now;
          break;
        }
        case 'custom': {
          if (createdCustomFrom) {
            const d = new Date(createdCustomFrom + 'T00:00:00');
            from = d;
          }
          if (createdCustomTo) {
            const d2 = new Date(createdCustomTo + 'T23:59:59');
            to = d2;
          }
          break;
        }
        default: {
          break;
        }
      }

      if (from || to) {
        rows = rows.filter((r) => {
          const d = new Date(r.createdOn);
          if (from && d < from) return false;
          if (to && d > to) return false;
          return true;
        });
      }
    } catch {
      // ignore date parsing errors
    }

    return rows;
  }, [subTab, categories, search, createdFilterOption, createdCustomFrom, createdCustomTo]);

  const categoryLabel: Record<string, string> = {
    returns: 'Returns/RTO & Exchange',
    cataloging: 'Cataloging & Pricing',
    orders: 'Orders & Delivery',
    payments: 'Payments',
    inventory: 'Inventory',
    account: 'Account',
    advertisements: 'Advertisements & Promotions',
    instantcash: 'Instant Cash',
    others: 'Others',
    warehouse: 'Warehouse',
  };

  // keep state in sync when URL changes externally (back/forward or direct link)
  React.useEffect(() => {
    const sp = searchParams;
    const s = sp?.get('support') || 'help';
    const sub = sp?.get('sub') || 'all';
  const ticket = sp?.get('ticket') ?? null;
  const form = sp?.get('form') ?? null;
  const question = sp?.get('question') ?? null;

  // debug incoming params (guarded to avoid SSR issues)
  if (typeof console !== 'undefined' && typeof console.debug === 'function') {
    console.debug('Support params:', { support: s, sub, ticket, form, question });
  }

    const newTab = s === 'my-tickets' || s === 'tickets' ? 1 : 0;
    const newSub = subKeyToIndex[sub] ?? 0;

    // avoid unnecessary state updates
    if (newTab !== tab) setTab(newTab);
    if (newSub !== subTab) setSubTab(newSub);
  if (ticket !== selectedTicketId) setSelectedTicketId(ticket);
  if (form !== helpFormId) {
    setHelpFormId(form);
    // when a new form is requested, ensure Help tab is active and reset form UI
    if (form) {
      if (tab !== 0) setTab(0);
      setHelpFormSubmitted(false);
      setHelpFormText('');
    }
  }
  if (question !== helpQuestion) setHelpQuestion(question);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const updateUrl = (supportValue?: string, subValue?: string) => {
    try {
      const params = new URLSearchParams(searchParams?.toString() ?? '');
      if (supportValue) params.set('support', supportValue);
      if (subValue) params.set('sub', subValue);

      const qs = params.toString();
      const href = qs ? `${globalThis.location?.pathname ?? ''}?${qs}` : (globalThis.location?.pathname ?? '');
      router.push(href);
    } catch {
      // noop
    }
  };

  // updated version that can set/remove ticket id
  // updateUrlWithTicket removed (not used)

  const pageCount = Math.max(1, Math.ceil(filtered.length / rowsPerPage));

  const visibleRows = React.useMemo(() => {
    // If a ticket is selected, show only that ticket in the table for focus
    if (selectedTicketId) return filtered.filter((r) => r.id === selectedTicketId);

    const start = (page - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, selectedTicketId]);

  const helpCols: { title: string; items: { label: string; form_id?: string }[]; icon?: React.ReactNode; slug?: string }[] = React.useMemo(() => {
    const iconMap: Record<string, React.ReactNode> = {
      returns: <ArrowUDownLeftIcon size={20} />,
      cataloging: <SquaresFourIcon size={20} />,
      orders: <PackageIcon size={20} />,
    };

    const order = ['returns', 'cataloging', 'orders'];

    type HelpItem = { label: string; form_id?: string };
    type HelpCategory = { title?: string; items?: HelpItem[] };

    return order.map((slug) => {
      const cat = (helpMap as unknown as Record<string, HelpCategory>)[slug];
      const title = cat?.title ?? slug;
      const items: HelpItem[] = Array.isArray(cat?.items)
        ? cat.items.slice(0, 3).map((it) => ({ label: it.label ?? String(it), form_id: it.form_id }))
        : [];
      return { title, slug, icon: iconMap[slug], items };
    }).filter(Boolean) as { title: string; items: HelpItem[]; icon?: React.ReactNode; slug?: string }[];
  }, []);

  // moved to top scope

  return (
    <> {/* show adv banner on Help tab only */}
          
           { tab === 0 && <AdvSupport />}
         
    <Box sx={{ p: 2, pt: 0, pb: 0, ml: -3, mr: -3, backgroundColor: '#ffffff' }}>
      <Tabs value={tab} onChange={(_, v) => {
        setTab(v);
        // update url: support=help | my-tickets
        updateUrl(v === 1 ? 'my-tickets' : 'help', v === 1 ? indexToSubKey[subTab] : undefined);
      }} sx={{ mb: 1 }}>
        <Tab label="Help" />
        <Tab label="My Tickets" />
      </Tabs>

      {tab === 0 && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h5">Select Issue Category</Typography>
            <TextField
              placeholder="Search for Issue or Question"
              size="small"
              sx={{ width: { xs: '100%', sm: 360 } }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
            />
          </Box>
        
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' } }}>
            {helpCols.map((col, i) => (
              <Box key={i}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        {col.icon ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {col.icon}
                            <Typography fontWeight={700}>{col.title}</Typography>
                          </Box>
                        ) : (
                          <Typography fontWeight={700}>{col.title}</Typography>
                        )}
                    </Box>
                    {col.items.map((it, j) => (
                      <Box
                        key={j}
                        onClick={() => {
                          const formId = it.form_id ?? '';
                          if (formId) {
                            const params = new URLSearchParams();
                            params.set('question', it.label);
                            params.set('form', formId);
                            params.set('support', 'help');
                            try {
                              const origin = globalThis.window ? globalThis.window.location.origin : '';
                              globalThis.window.location.href = `${origin}/dashboard/support/form/${formId}?${params.toString()}`;
                            } catch {
                              router.push(`/dashboard/support/form/${formId}?${params.toString()}`);
                            }
                          }
                        }}
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1, borderBottom: j < col.items.length - 1 ? '1px dashed #eee' : 'none', cursor: 'pointer' }}
                      >
                        <Typography color="text.secondary">{it.label}</Typography>
                        <IconButton size="small"><ArrowForwardIosIcon fontSize="small" /></IconButton>
                      </Box>
                    ))}
                    <Box sx={{ mt: 1 }}>
                      <Button color="primary" sx={{ fontWeight: 700 }} onClick={() => router.push(`/dashboard/support/help/${col.slug}`)}>View All</Button>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
            {/* Extra quick category tiles (as in the screenshot) */}
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' } }}>
              {['Payments', 'Inventory', 'Account', 'Advertisements & Promotions', 'Instant Cash', 'Others'].map((t) => {
                const emojiMap: Record<string, string> = {
                  Payments: '💳',
                  Inventory: '📦',
                  Account: '👤',
                  'Advertisements & Promotions': '📣',
                  'Instant Cash': '💸',
                  Others: '🧩',
                };
                const icon = emojiMap[t] ?? '🔖';

                return (
                  <Paper
                    key={t}
                    variant="outlined"
                    onClick={() => router.push(`/dashboard/support/help/${t.toLowerCase().split(' ')[0]}`)}
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, borderRadius: 1, cursor: 'pointer' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 36, height: 36, borderRadius: 1, backgroundColor: '#f5f7fb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box component="span" sx={{ fontSize: 18 }}>{icon}</Box>
                      </Box>
                      <Typography sx={{ fontWeight: 700 }}>{t}</Typography>
                    </Box>
                    <ArrowForwardIosIcon sx={{ color: 'action.active' }} />
                  </Paper>
                );
              })}

              
            </Box>
            

            {/* Recently raised tickets table */}
            <Box sx={{ mt: 1 }}>
              <Typography sx={{ mb: 1, fontWeight: 700 }}>Recently raised tickets</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Created On</TableCell>
                      <TableCell>Ticket ID</TableCell>
                      <TableCell>Issue</TableCell>
                      <TableCell>Last Update</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockTickets.slice(0, 6).map((t) => (
                      <TableRow key={t.id} hover>
                        <TableCell>{new Date(t.createdOn).toLocaleString()}</TableCell>
                        <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>{t.id}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{t.issue}</TableCell>
                        <TableCell>{t.lastUpdate || ''}</TableCell>
                        <TableCell>
                          <Typography sx={{ color: t.status === 'Closed' ? 'success.main' : t.status === 'In Progress' ? 'warning.main' : undefined }}>{t.status}</Typography>
                        </TableCell>
                        <TableCell>
                          <Button size="small" variant="outlined" onClick={() => router.push(`/dashboard/support/ticket/${t.id}`)}>View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
         <Button sx={{ mt: 2 }} variant="outlined" onClick={() => router.push('http://localhost:3000/dashboard/support?support=my-tickets&sub=all')}>View All Tickets</Button>
         
        </Box>
      )}

      {tab === 1 && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Box>
              <Tabs value={subTab} onChange={(_, v) => { setSubTab(v); setPage(1); updateUrl('my-tickets', indexToSubKey[v]); }} sx={{ mb: 0 }}>
                <Tab label={<span>All</span>} />
                <Tab label={<span>Needs Attention</span>} />
                <Tab label={<span>In Progress</span>} />
                <Tab label={<span>Closed</span>} />
              </Tabs>

              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
                <Typography sx={{ mr: 1 }}>Filter by :</Typography>
                {/* Created Date filter as popover with radio options */}
                <Box>
                  <Button size="small" variant="outlined" onClick={(e) => setCreatedAnchorEl(e.currentTarget)}>
                    Created Date: {createdFilterOption === 'all' ? 'All' : createdFilterOption === 'custom' ? (createdCustomFrom || 'Custom') : (createdFilterOption === 'yesterday' ? 'Yesterday' : createdFilterOption === 'last2days' ? 'Last 2 days' : 'Last 1 week')}
                  </Button>
                  <Popover
                    open={Boolean(createdAnchorEl)}
                    anchorEl={createdAnchorEl}
                    onClose={() => setCreatedAnchorEl(null)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                  >
                    <Box sx={{ p: 2, minWidth: 220 }}>
                      <RadioGroup value={createdFilterOption} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCreatedFilterOption(e.target.value as 'all' | 'yesterday' | 'last2days' | 'last1week' | 'custom')}>
                        <FormControlLabel value="all" control={<Radio />} label="All" />
                        <FormControlLabel value="yesterday" control={<Radio />} label="Yesterday" />
                        <FormControlLabel value="last2days" control={<Radio />} label="Last 2 days" />
                        <FormControlLabel value="last1week" control={<Radio />} label="Last 1 week" />
                        <FormControlLabel value="custom" control={<Radio />} label="Custom Date Range" />
                      </RadioGroup>

                      {createdFilterOption === 'custom' && (
                        <Box sx={{ display: 'flex', gap: 1, mt: 1, alignItems: 'center' }}>
                          <TextField
                            size="small"
                            type="date"
                            label="From"
                            InputLabelProps={{ shrink: true }}
                            value={createdCustomFrom}
                            onChange={(e) => setCreatedCustomFrom(e.target.value)}
                          />
                          <TextField
                            size="small"
                            type="date"
                            label="To"
                            InputLabelProps={{ shrink: true }}
                            value={createdCustomTo}
                            onChange={(e) => setCreatedCustomTo(e.target.value)}
                          />
                        </Box>
                      )}

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Link component="button" variant="body2" onClick={() => {
                          // clear date filter entirely
                          setCreatedFilterOption('all'); setCreatedCustomFrom(''); setCreatedCustomTo(''); setCreatedAnchorEl(null);
                        }}>Clear Filter</Link>
                        <Box>
                          <Button size="small" onClick={() => setCreatedAnchorEl(null)}>Apply</Button>
                        </Box>
                      </Box>
                    </Box>
                  </Popover>
                </Box>

                {/* Issue Category multi-select popover with checkboxes */}
                <Box>
                  <Button size="small" variant="outlined" onClick={(e) => { setCategoryAnchorEl(e.currentTarget); setTempCategories(categories); }}>
                    {categories.length === 0 ? 'Issue Category' : (categories.length === 1 ? categories[0] : `${categories.length} Issue Categories`)}
                  </Button>
                  <Popover
                    open={Boolean(categoryAnchorEl)}
                    anchorEl={categoryAnchorEl}
                    onClose={() => setCategoryAnchorEl(null)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                  >
                    <Box sx={{ p: 1, minWidth: 220 }}>
                      <List>
                        {[
                          { key: 'returns', label: 'Returns/RTO & Exchange' },
                          { key: 'cataloging', label: 'Cataloging & Pricing' },
                          { key: 'orders', label: 'Orders & Delivery' },
                          { key: 'payments', label: 'Payments' },
                          { key: 'inventory', label: 'Inventory' },
                          { key: 'account', label: 'Account' },
                          { key: 'advertisements', label: 'Advertisements & Promotions' },
                          { key: 'instantcash', label: 'Instant Cash' },
                          { key: 'others', label: 'Others' },
                          { key: 'warehouse', label: 'Warehouse' },
                        ].map((opt) => (
                          <ListItem key={opt.key} dense sx={{ py: 0 }}>
                            <ListItemButton sx={{ py: 0 }} onClick={() => {
                              if (tempCategories.includes(opt.key)) setTempCategories(tempCategories.filter((c) => c !== opt.key)); else setTempCategories([...tempCategories, opt.key]);
                            }}>
                              <ListItemIcon sx={{ minWidth: 36, mr: 0.5 }}>
                                <Checkbox size="small" edge="start" checked={tempCategories.includes(opt.key)} tabIndex={-1} disableRipple />
                              </ListItemIcon>
                              <ListItemText primary={opt.label} sx={{ my: 0 }} />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, px: 1 }}>
                        <Link component="button" variant="body2" onClick={() => { setTempCategories([]); }}>Clear Filter</Link>
                        <Button size="small" variant="contained" onClick={() => { setCategories(tempCategories); setCategoryAnchorEl(null); setPage(1); }}>Apply Filter</Button>
                      </Box>
                    </Box>
                  </Popover>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                placeholder="Search by Sub Order ID or Ticket ID"
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') setPage(1); }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                  endAdornment: search ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => { setSearch(''); setPage(1); }}><CloseIcon fontSize="small" /></IconButton>
                    </InputAdornment>
                  ) : null,
                }}
                sx={{ width: { xs: 240, sm: 420 } }}
              />
            </Box>
          </Box>

          <TableContainer component={Paper} sx={{ mb: 2 }}>
            {/* Filter summary row (results + active filter chips) */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, gap: 1 }}>
              <Typography variant="body2">{filtered.length} result{filtered.length === 1 ? '' : 's'} found</Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {createdFilterOption !== 'all' && (
                  <Chip
                    label={createdFilterOption === 'custom' ? (`Created ${createdCustomFrom || ''}${createdCustomFrom && createdCustomTo ? ' - ' : ''}${createdCustomTo || ''}`) : (createdFilterOption === 'yesterday' ? 'Created Yesterday' : createdFilterOption === 'last2days' ? 'Created Last 2 days' : 'Created Last 1 week')}
                    onDelete={() => { setCreatedFilterOption('all'); setCreatedCustomFrom(''); setCreatedCustomTo(''); setPage(1); }}
                    size="small"
                  />
                )}

                {categories.length > 0 && (
                  <Chip
                    label={categories.length === 1 ? (`Issue Category: ${categoryLabel[categories[0]] ?? categories[0]}`) : (`${categories.length} Issue Categories`)}
                    onDelete={() => { setCategories([]); setPage(1); }}
                    size="small"
                  />
                )}

                {(createdFilterOption !== 'all' || categories.length > 0) && (
                  <Link component="button" variant="body2" onClick={() => { setCreatedFilterOption('all'); setCreatedCustomFrom(''); setCreatedCustomTo(''); setCategories([]); setPage(1); }} sx={{ ml: 1 }}>
                    Clear All
                  </Link>
                )}
              </Box>
            </Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Created On</TableCell>
                  <TableCell>Ticket ID</TableCell>
                  <TableCell>Issue</TableCell>
                  <TableCell>Last Update</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {visibleRows.map((t) => (
                  <TableRow key={t.id} hover sx={{ cursor: 'pointer' }} onClick={() => { console.debug('navigating to ticket', t.id); router.push(`/dashboard/support/ticket/${t.id}`); }}>
                    <TableCell>{new Date(t.createdOn).toLocaleString()}</TableCell>
                    <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>{t.id}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{t.issue}</TableCell>
                    <TableCell>{t.lastUpdate || ''}</TableCell>
                    <TableCell>
                      <Typography sx={{ color: t.status === 'Closed' ? 'success.main' : t.status === 'In Progress' ? 'warning.main' : undefined }}>
                        {t.status}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button variant="outlined" size="small" onClick={(e) => { e.stopPropagation(); console.debug('view button nav', t.id); router.push(`/dashboard/support/ticket/${t.id}`); }}>View</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {visibleRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography color="text.secondary">No tickets found</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Detail panel */}
          {selectedTicketId && (() => {
            const selectedTicket = mockTickets.find((x) => x.id === selectedTicketId);
            if (!selectedTicket) return <Box sx={{ mt: 2 }}><Typography>No ticket found</Typography></Box>;

            return (
              <Box sx={{ mt: 2, p: 2, border: '1px solid #eee', display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{selectedTicket.issue}</Typography>
                  <Typography variant="body2" color="text.secondary">Created on {new Date(selectedTicket.createdOn).toLocaleString()}</Typography>

                  <Box sx={{ mt: 2 }}>
                      <Button color="primary" sx={{ fontWeight: 700 }} onClick={() => router.push(`/dashboard/support/help/${getCategoryKeyFromText(selectedTicket.issue)}`)}>View All</Button>
                    <Typography sx={{ mb: 1 }}>{selectedTicket.status}</Typography>

                    <Typography variant="subtitle2">Sub Order Number</Typography>
                    <Typography sx={{ mb: 1 }}>88796286744663360_1</Typography>

                    <Typography variant="subtitle2">Packet ID</Typography>
                    <Typography sx={{ mb: 1 }}>DLVPCS156252762</Typography>

                    <Typography variant="subtitle2">Callback Number</Typography>
                    <Typography sx={{ mb: 1 }}>9911269944</Typography>
                  </Box>
                </Box>

                <Box sx={{ width: 360 }}>
                  <Typography variant="h6">Updates</Typography>
                  <Box sx={{ mt: 1 }}>
                    {[{ date: '3 DEC', text: selectedTicket.lastUpdate ?? '' }, { date: '2 DEC', text: 'Your claim of Rs.1521.036 for this order has been scheduled' }, { date: '28 NOV', text: 'Meesho support agent will share an update within 3 hours' }].map((u, i) => (
                      <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', py: 1, borderBottom: '1px dashed #eee' }}>
                        <Box sx={{ border: '1px solid #6b46c1', borderRadius: 1, px: 1, py: 0.5, color: '#6b46c1' }}>{u.date}</Box>
                        <Box>
                          <Typography sx={{ fontSize: 13 }}>{u.text}</Typography>
                          <Typography variant="caption" color="text.secondary">05:11 PM</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            );
          })()}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Pagination page={page} count={pageCount} onChange={(_, v) => setPage(v)} color="primary" />
          </Box>
        </Box>
      )}
    </Box></>
  );
}
